import {inject, injectable} from "tsyringe";
import {SpaceRepository} from "../repository/spaceRepository";
import {CreateSpaceDto} from "../dtos/spaceDTO";
import {HttpException} from "../exceptions/httpException";
import {Request, Response} from "express";
import {upload} from "../config/multerConfig";

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

    uploadDocuments = async (req: Request, res: Response) => {
        await new Promise<void>((resolve, reject) => {
            upload.array('files', 10)(req, res, (err: any) => {
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
        return {
            statusCode: 200,
            message: "File(s) uploaded successfully!",
            data: filesInfo
        };
    }
}