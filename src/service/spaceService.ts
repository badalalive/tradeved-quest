import {inject, injectable} from "tsyringe";
import {SpaceRepository} from "../repository/spaceRepository";
import {CreateSpaceDto} from "../dtos/spaceDTO";
import {HttpException} from "../exceptions/httpException";
import {Request, Response} from "express";
import {uploadDocument, uploadImage} from "../config/multerConfig";
import {verificationMailTemplate} from "../templates/mailTemplate";
import {generateRandomToken, sendEmail} from "../utils/utilities";

@injectable()
export class SpaceService {
    constructor (
        @inject("SpaceRepository")
        private spaceRepository: SpaceRepository,
    ) {}

    createSpace = async (spaceDTO: CreateSpaceDto) => {

        // Check if the space with the same email or company name already exists
        let existingSpace = await this.spaceRepository.findSpaceByEmailOrCompanyName(spaceDTO.email, spaceDTO.company_name);
        if (existingSpace) {
            throw new HttpException(409, 'Space with this email/company already exists.');
        }
        const spaceName = spaceDTO.name;
        if(spaceName) {
            existingSpace = await this.spaceRepository.findSpaceByName(spaceName);
        }
        if(existingSpace) {
            throw new HttpException(409, 'Space with name already exist');
        }

        // Create a new space using the repository
        try {
            const newSpace = await this.spaceRepository.create(
                spaceDTO
            );

            return {
                message: 'Space successfully created.',
                data: newSpace,
                statusCode: 201,
            };
        } catch (error) {
            throw new HttpException(500, 'Error creating the space.');
        }
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

    uploadDocuments = async (req: Request, res: Response) => {
        const spaceId = String(req.params.id);
        const space = await this.spaceRepository.findSpaceById(spaceId);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
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
            path: `${process.env.SERVER_URL}/${file.destination}${file.filename}`
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

    sentVerificationEmail = async (spaceId: string) => {
        const space = await this.spaceRepository.findSpaceById(spaceId);
        if(!space) {
            throw new HttpException(404, 'Space doe not exist')
        }
        if (space.is_email_verified) {
            throw new HttpException(409, "Email Already Verified")
        }
        const token = generateRandomToken(24);
        const link = `${process.env.SERVER_URL}verify-email/${token}`
        const emailContent = verificationMailTemplate(link);
        // save email verification token
        await this.spaceRepository.createEmailVerificationToken(spaceId, token);
        await sendEmail(space.email, "Space Email Verification", emailContent)
        return {
            statusCode: 200,
            message: "Email Sent",
            data: space
        };
    }

    verifyEmail = async (token: string) => {
        const spaceEmailVerification = await this.spaceRepository.findSpaceEmailVerificationByToken(token);

        if(!spaceEmailVerification) {
            throw new HttpException(500, 'Invalid Request')
        }

        if(!spaceEmailVerification.space_id) {
            throw new HttpException(500, 'Invalid Space')
        }

        if (spaceEmailVerification.is_expired) {
            throw new HttpException(410, "Token has expired");
        }

        await this.spaceRepository.expireEmailVerificationTokens(spaceEmailVerification.space_id);
        return {
            statusCode: 200,
            message: "Email Verified Successfully",
            data: spaceEmailVerification
        }
    }

    addSpaceLinks = async (spaceId: string, link: string) => {
        const spaceLink = await this.spaceRepository.createSpaceLink(spaceId, link)
        return {
            statusCode: 200,
            message: "Space Link Attached Successfully",
            data: spaceLink
        }
    }

    addLogo = async (req: Request, res: Response) => {
        const spaceId = String(req.params.id);
        const space = await this.spaceRepository.findSpaceById(spaceId);
        if (!space) {
            throw new HttpException(400, 'Space does not exist');
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
        await this.spaceRepository.createSpaceLogo(spaceId, fileInfo.path)
        return {
            statusCode: 200,
            message: "Logo uploaded successfully!",
            data: fileInfo
        };
    };
}