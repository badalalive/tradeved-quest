import {inject, injectable} from "tsyringe";
import {SpaceRepository} from "../repository/spaceRepository";
import {CreateSpaceDto} from "../dto/spaceDTO";
import {HttpException} from "../exceptions/httpException";
import {Request, Response} from "express";
import {uploadDocument, uploadImage} from "../config/multerConfig";
import {verificationMailTemplate} from "../templates/mailTemplate";
import {generateRandomToken, sendEmail} from "../utils/utilities";
import {KeyStatus, Space, SpaceLinks, SpaceStatus} from "@prisma/client";
import {TokenRepository} from "../repository/tokenRepository";

@injectable()
export class SpaceService {
    constructor (
        @inject("SpaceRepository")
        private spaceRepository: SpaceRepository,
        @inject("TokenRepository")
        private tokenRepository: TokenRepository,
    ) {}

    createSpace = async (tokenData: any, spaceDTO: CreateSpaceDto) => {
        const space = await this.spaceRepository.findSpaceById(tokenData.space_id);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.PENDING) {
            throw new HttpException(400, 'invalid Request');
        }
        // Check if the space with the company name already exists
        if (spaceDTO.company_name) {
            const existingSpace: any = await this.spaceRepository.findSpaceByCompanyName(spaceDTO.company_name);
            if (existingSpace && existingSpace.id !== tokenData.space_id) {
                throw new HttpException(409, 'Space with this company name already exists.');
            }
        }
        if (spaceDTO.name) {
            const existingSpace: any = await this.spaceRepository.findSpaceByName(spaceDTO.name);
            if (existingSpace && existingSpace.id !== tokenData.space_id) {
                throw new HttpException(409, 'Space with this space name already exists.');
            }
        }
        const newSpace = await this.spaceRepository.updateSpaceById(
            tokenData.space_id,
            spaceDTO
        );
        // if link is present then perform the query
        if(spaceDTO.links && spaceDTO.links.length > 0) {
            const spaceLinks: any[] = [];
            spaceDTO.links.map((link: string) => {
                const spaceLink: any = {
                    link: link,
                    space_id: space.id,
                    created_by: space.id,
                    updated_by: space.id
                }
                spaceLinks.push(spaceLink)
            })
            const result = await this.spaceRepository.createSpaceLinks(spaceLinks);
        }

        return {
            message: 'Space Details Updated',
            data: newSpace,
            statusCode: 201,
        };
    };

    getSpace = async (spaceId: string) => {
        const space = await this.spaceRepository.findSpaceById(spaceId);
        if(!space) {
            throw new HttpException(404, "Space does not exist");
        }
        return {
            statusCode: 200,
            message: "Space Details Fetch Successfully",
            data: space
        }
    }

    uploadDocuments = async (tokenData: any, req: Request, res: Response) => {
        const spaceId = String(req.params.id);
        const space = await this.spaceRepository.findSpaceById(spaceId);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.PENDING) {
            throw new HttpException(400, 'invalid Request');
        }
        await new Promise<void>((resolve, reject) => {
            uploadDocument.array('files', 10)(req, res, (err: any) => {
                if (err) {
                    return reject(new HttpException(400, err.message));
                }
                if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
                    return reject(new HttpException(400, "No file uploaded"));
                }
                resolve();
            });
        });

        const filesInfo = (req.files as Express.Multer.File[]).map(file => ({
            filename: file.originalname,
            path: `${process.env.SERVER_URL}${file.destination}${file.filename}`
        }));
        let spaceDocuments: any[] = [];
        if (filesInfo.length > 0) {
            filesInfo.map((f)=> {
                const spaceDocument: any = {
                    space_id: spaceId,
                    path: f.path,
                    created_by: spaceId,
                    updated_by: spaceId,
                }
                spaceDocuments.push(spaceDocument);
            })
            await this.spaceRepository.createSpaceDocuments(spaceDocuments)
        }

        return {
            statusCode: 200,
            message: "File(s) uploaded successfully!",
            data: filesInfo
        };
    }

    sentSpaceCreationLink = async (email: string) => {
        let space: any = await this.spaceRepository.findSpaceByEmail(email)
        // if email is not associate with any space then create new one else create new token that's it
        if(!space) {
            space = await this.spaceRepository.create(email);
        }
        if (space.status !== SpaceStatus.PENDING) {
            throw new HttpException(400, 'invalid Request');
        }
        // save email verification token
        const tokenData: any = await this.tokenRepository.createToken(space.id);
        const link = `${process.env.SPACE_FRONTEND_END_POINT}create-space/verify-email/${tokenData.token}`
        const emailContent = verificationMailTemplate(link);
        await sendEmail(space.email, "Space Creation Link", emailContent)
        return {
            statusCode: 200,
            message: "Link Sent",
            data: space
        };
    }

    verifySpaceLink = async (tokenData: any) => {
        const space = tokenData.space_id ? await this.spaceRepository.findSpaceById(tokenData.space_id) : {};

        return {
            statusCode: 200,
            message: "Email Verified Successfully",
            data: space
        }
    }

    addSpaceLinks = async (tokenData: any, link: string) => {
        const space = await this.spaceRepository.findSpaceById(tokenData.space_id);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.PENDING) {
            throw new HttpException(400, 'invalid Request');
        }
        const spaceLink = await this.spaceRepository.createSpaceLink(tokenData.space_id, link)
        return {
            statusCode: 200,
            message: "Space Link Attached Successfully",
            data: spaceLink
        }
    }

    addLogo = async (tokenData: any, req: Request, res: Response) => {
        const space = await this.spaceRepository.findSpaceById(tokenData.space_id);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.PENDING) {
            throw new HttpException(400, 'invalid Request');
        }
        // Use the `uploadImage` middleware for single image upload
        await new Promise<void>((resolve, reject) => {
            uploadImage.single('file')(req, res, (err: any) => {
                if (err) {
                    return reject(new HttpException(400, err.message));
                }
                if (!req.file) {
                    return reject(new HttpException(400, "No file uploaded"));
                }
                resolve();
            });
        });

        const fileInfo = {
            filename: req.file?.originalname,
            path: `${process.env.SERVER_URL}${req.file?.destination}${req.file?.filename}`,
        };
        await this.spaceRepository.createSpaceLogo(tokenData.space_id, fileInfo.path)
        return {
            statusCode: 200,
            message: "Logo uploaded successfully!",
            data: fileInfo
        };
    };

    addBanner = async (tokenData: any, req: Request, res: Response) => {
        const space = await this.spaceRepository.findSpaceById(tokenData.space_id);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.PENDING) {
            throw new HttpException(400, 'invalid Request');
        }
        // Use the `uploadImage` middleware for single image upload
        await new Promise<void>((resolve, reject) => {
            uploadImage.single('file')(req, res, (err: any) => {
                if (err) {
                    return reject(new HttpException(400, err.message));
                }
                if (!req.file) {
                    return reject(new HttpException(400, "No file uploaded"));
                }
                resolve();
            });
        });

        const fileInfo = {
            filename: req.file?.originalname,
            path: `${process.env.SERVER_URL}${req.file?.destination}${req.file?.filename}`,
        };
        await this.spaceRepository.createSpaceBanner(tokenData.space_id, fileInfo.path)
        return {
            statusCode: 200,
            message: "Banner uploaded successfully!",
            data: fileInfo
        };
    };

    updateStatus = async (spaceId: string, type: string, reject_reason: string) => {
        let space = await this.spaceRepository.findSpaceById(spaceId);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== 'PENDING') {
            throw new HttpException(400, 'invalid action');
        }
        const status = SpaceStatus[type as keyof typeof SpaceStatus];
        space = await this.spaceRepository.updateSpaceStatus(spaceId, status, reject_reason)

        return {
            statusCode: 200,
            message: `${status} Successfully`,
            data: space
        }
    }

    submitForm = async (tokenData: any) => {
        let space: any = await this.spaceRepository.findSpaceById(tokenData.space_id);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }

        // Check if space is already submitted for review
        if (space.status === SpaceStatus.REVIEW) {
            throw new HttpException(409, 'Already Submitted');
        }

        // Check if the request is valid based on the current status
        if (space.status !== SpaceStatus.PENDING) {
            throw new HttpException(400, 'Invalid Request');
        }

        // Validate that all required fields are filled
        const requiredFields = ['company_name', 'name', 'description', 'email', 'logo_url', 'category'];

        for (const field of requiredFields) {
            if (!space[field]) {
                throw new HttpException(400, `Field ${field} is required and not filled.`);
            }
        }

        // Check that there is at least one SpaceLink
        if (!space.links || space.links.length === 0) {
            throw new HttpException(400, 'At least one space link is required.');
        }

        // Check that there is at least one SpaceDocument
        if (!space.documents || space.documents.length === 0) {
            throw new HttpException(400, 'At least one space document is required.');
        }

        // Update the space status to "REVIEW" if validation passes
        space = await this.spaceRepository.updateSpaceStatus(space.id, SpaceStatus.REVIEW, "");

        // Return the success response
        return {
            data: space,
            statusCode: 200,
            message: "Submit For Review",
        };
    };

}