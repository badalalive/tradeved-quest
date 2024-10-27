import {inject, injectable} from "tsyringe";
import {SpaceRepository} from "../repository/spaceRepository";
import {CreateSpaceDto} from "../dto/spaceDTO";
import {HttpException} from "../exceptions/httpException";
import {Request, Response} from "express";
import {spaceFormSubmissionMailTemplate, verificationMailTemplate} from "../templates/mailTemplate";
import {sendEmail, stringToArray} from "../utils/utilities";
import {SpaceStatus} from "@prisma/client";
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
        let space: any = tokenData.space;
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.INITIATED) {
            throw new HttpException(400, 'invalid Request');
        }
        // Check if the space with the company name already exists
        // if (spaceDTO.company_name) {
        //     const existingSpace: any = await this.spaceRepository.findSpaceByCompanyName(spaceDTO.company_name);
        //     if (existingSpace && existingSpace.id !== tokenData.space_id) {
        //         throw new HttpException(409, 'Space with this company name already exists.');
        //     }
        // }
        // if (spaceDTO.name) {
        //     const existingSpace: any = await this.spaceRepository.findSpaceByName(spaceDTO.name);
        //     if (existingSpace && existingSpace.id !== tokenData.space_id) {
        //         throw new HttpException(409, 'Space with this space name already exists.');
        //     }
        // }
        const newSpace: any = await this.spaceRepository.updateSpaceById(
            tokenData.space_id,
            spaceDTO
        );
        // if link is present then perform the query
        if(spaceDTO.links && spaceDTO.links.length > 0) {
            const spaceLinks: any[] = [];
            spaceDTO.links.map((link: string) => {
                const spaceLink: any = {
                    link: link,
                    space_id: tokenData.space_id,
                    created_by: tokenData.space_id,
                    updated_by: tokenData.space_id
                }
                spaceLinks.push(spaceLink)
            })
            await this.spaceRepository.createSpaceLinks(spaceLinks);
            newSpace.links = spaceLinks;
        }
        (newSpace.category as any) = stringToArray(newSpace.category);
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
        // string of array category to array of category
        (space.category as any) = stringToArray(space.category);
        return {
            statusCode: 200,
            message: "Space Details Fetch Successfully",
            data: space
        }
    }

    getAll = async () => {
        const spaces = await this.spaceRepository.findAllSpace();
        // string of array category to array of category
        spaces.map((space) => (space.category as any) = stringToArray(space.category));
        return {
            statusCode: 200,
            message: "Fetch All Spaces",
            data: spaces
        }
    }

    uploadDocuments = async (tokenData: any, req: Request, res: Response) => {
        const spaceId = tokenData.space_id;
        let space: any = tokenData.space;
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.INITIATED) {
            throw new HttpException(400, 'invalid Request');
        }
        // await new Promise<void>((resolve, reject) => {
        //     uploadDocument.array('files', 10)(req, res, (err: any) => {
        //         if (err) {
        //             return reject(new HttpException(400, err.message));
        //         }
        //         if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        //             return reject(new HttpException(400, "No file uploaded"));
        //         }
        //         resolve();
        //     });
        // });

        // const filesInfo = (req.files as Express.Multer.File[]).map(file => ({
        //     filename: file.originalname,
        //     path: `${process.env.SERVER_URL}${file.destination}${file.filename}`
        // }));
        // let spaceDocuments: any[] = [];
        // if (filesInfo.length > 0) {
        //     filesInfo.map((f)=> {
        //         const spaceDocument: any = {
        //             space_id: spaceId,
        //             path: f.path,
        //             filename: f.filename,
        //             created_by: spaceId,
        //             updated_by: spaceId,
        //         }
        //         spaceDocuments.push(spaceDocument);
        //     })
        //     await this.spaceRepository.createSpaceDocuments(spaceDocuments)
        // }
            await this.spaceRepository.createSpaceDocuments([
                {
                    space_id: spaceId,
                    path: "https://your-server.com/uploads/documents/example.pdf",
                    filename: "example.pdf",
                    created_by: spaceId,
                    updated_by: spaceId,
                }
            ])
        return {
            statusCode: 200,
            message: "File(s) uploaded successfully!",
            data: [
                {
                    "filename": "example.pdf",
                    "path": "https://your-server.com/uploads/documents/example.pdf"
                }
            ]
        };
    }

    sentSpaceCreationLink = async (email: string) => {
        let space: any = await this.spaceRepository.findSpaceByEmail(email)
        // if email is not associate with any space then create new one else create new token that's it
        if(!space) {
            space = await this.spaceRepository.create(email);
        }
        if (space.status !== SpaceStatus.INITIATED) {
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
        const space: any = tokenData.space_id ? await this.spaceRepository.findSpaceById(tokenData.space_id) : {};
        if (space.status !== SpaceStatus.INITIATED) {
            throw new HttpException(400, 'invalid Request');
        }
        // string of array category to array of category
        (space.category as any) = stringToArray(space.category);
        return {
            statusCode: 200,
            message: "Email Verified Successfully",
            data: space
        }
    }

    addSpaceLinks = async (tokenData: any, link: string) => {
        let space: any = tokenData.space;
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.INITIATED) {
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
        let space: any = tokenData.space;
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.INITIATED) {
            throw new HttpException(400, 'invalid Request');
        }
        // Use the `uploadImage` middleware for single image upload
        // await new Promise<void>((resolve, reject) => {
        //     uploadImage.single('file')(req, res, (err: any) => {
        //         if (err) {
        //             return reject(new HttpException(400, err.message));
        //         }
        //         if (!req.file) {
        //             return reject(new HttpException(400, "No file uploaded"));
        //         }
        //         resolve();
        //     });
        // });

        // const fileInfo = {
        //     filename: req.file?.originalname,
        //     path: `${process.env.SERVER_URL}${req.file?.destination}${req.file?.filename}`,
        // };
        await this.spaceRepository.createSpaceLogo(tokenData.space_id, "https://yourserver.com/uploads/images/logo.png")
        return {
            statusCode: 200,
            message: "Logo uploaded successfully!",
            data: {
                "filename": "logo.png",
                "path": "https://yourserver.com/uploads/images/logo.png"
            }
        };
    };

    addBanner = async (tokenData: any, req: Request, res: Response) => {
        let space: any = tokenData.space;
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.INITIATED) {
            throw new HttpException(400, 'invalid Request');
        }
        // Use the `uploadImage` middleware for single image upload
        // await new Promise<void>((resolve, reject) => {
        //     uploadImage.single('file')(req, res, (err: any) => {
        //         if (err) {
        //             return reject(new HttpException(400, err.message));
        //         }
        //         if (!req.file) {
        //             return reject(new HttpException(400, "No file uploaded"));
        //         }
        //         resolve();
        //     });
        // });
        //
        // const fileInfo = {
        //     filename: req.file?.originalname,
        //     path: `${process.env.SERVER_URL}${req.file?.destination}${req.file?.filename}`,
        // };
        // await this.spaceRepository.createSpaceBanner(tokenData.space_id, fileInfo.path)
        return {
            statusCode: 200,
            message: "Banner uploaded successfully!",
            data: {
                "filename": "banner.png",
                "path": "https://yourserver.com/uploads/images/banner.png"
            }
        };
    };

    updateStatus = async (spaceId: string, type: string, reject_reason: string) => {
        let space = await this.spaceRepository.findSpaceById(spaceId);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
        }
        if (space.status !== SpaceStatus.INITIATED) {
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
        let space: any = tokenData.space;
        // Check if space is already submitted for review
        if (space.status === SpaceStatus.REVIEW) {
            throw new HttpException(409, 'Already Submitted');
        }

        // Check if the request is valid based on the current status
        if (space.status !== SpaceStatus.INITIATED) {
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

        const emailContent = spaceFormSubmissionMailTemplate();
        await sendEmail(space.email, "Space Form Submission", emailContent)

        // Return the success response
        return {
            data: space,
            statusCode: 200,
            message: "Submit For Review",
        };
    };

}