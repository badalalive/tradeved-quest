import {inject, injectable} from "tsyringe";
import {SpaceService} from "../service/spaceService";
import {NextFunction, Request, Response} from "express";
import {CreateSpaceDto} from "../dto/spaceDTO";
import {HttpException} from "../exceptions/httpException";

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

    getSpace = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spaceId: string = req.params.id;
            if(!spaceId) {
                throw new HttpException(400, "invalid spaceID");
            }
            const {data, message, statusCode} = await this.spaceService.getSpace(spaceId);
            res.status(statusCode).send({ data, message})
        } catch(error: any) {
            next(error)
        }
    }

    uploadDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.uploadDocuments(req, res);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    sentVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.sentVerificationEmail(req.params.id);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.verifyEmail(req.params.token);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    addSpaceLinks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {link} = req.body;
            const spaceId = String(req.params.id);
            if (!link) {
                throw new HttpException(400, "invalid link")
            }
            const {data, message, statusCode} = await this.spaceService.addSpaceLinks(spaceId, link);
            res.status(statusCode).send({ data, message})
        } catch(error: any) {
            next(error)
        }
    }

    addLogo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spaceId = req.params.id;
            if (!spaceId) {
                throw new HttpException(400, "invalid space id")
            }
            const {data, message, statusCode} = await this.spaceService.addLogo(spaceId, req, res);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spaceId = req.params.id;
            const type = req.params.type;
            let reject_reason = req.body.reject_reason;
            if (!spaceId) {
                throw new HttpException(400, "invalid space id")
            }
            if (!(type === 'APPROVED' || type === 'REJECTED')) {
                throw new HttpException(400, "invalid status type")
            }
            if (type === 'APPROVED') {
                reject_reason = "";
            }
            const {data, message, statusCode} = await this.spaceService.updateStatus(spaceId, type, reject_reason);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

}