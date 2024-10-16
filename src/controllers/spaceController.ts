import {inject, injectable} from "tsyringe";
import {SpaceService} from "../service/spaceService";
import {NextFunction, Request, Response} from "express";
import {CreateSpaceDto} from "../dtos/spaceDTO";

@injectable()
export class SpaceController {
    constructor (
        @inject("SpaceService")
        private spaceService: SpaceService,
    ) {
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spaceDto: CreateSpaceDto = req.body;
            const {data, message, statusCode} = await this.spaceService.createSpace(spaceDto);
            res.status(statusCode).send({ data, message})
        } catch(error: any) {
            next(error)
        }
    }

}