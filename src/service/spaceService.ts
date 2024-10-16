import {inject, injectable} from "tsyringe";
import {SpaceRepository} from "../repository/spaceRepository";
import {CreateSpaceDto} from "../dtos/spaceDTO";
import {HttpException} from "../exceptions/httpException";

@injectable()
export class SpaceService {
    constructor (
        @inject("SpaceRepository")
        private spaceRepository: SpaceRepository,
    ) {}

    createSpace = async (spaceDTO: CreateSpaceDto) => {

        // Check if the space with the same email already exists
        const existingSpace = await this.spaceRepository.findSpaceByEmail(spaceDTO.email);
        if (existingSpace) {
            throw new HttpException(409, 'Space with this email already exists.');
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
}