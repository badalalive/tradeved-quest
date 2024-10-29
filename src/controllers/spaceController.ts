import {inject, injectable} from "tsyringe";
import {SpaceService} from "../service/spaceService";
import {NextFunction, Request, Response} from "express";
import {CreateSpaceDto} from "../dto/spaceDTO";
import {HttpException} from "../exceptions/httpException";
import {EmailDto} from "../dto/emailDTO";
import { plainToInstance  } from "class-transformer";
import { validate } from "class-validator";
import {extractErrorMessages, stringToArray} from "../utils/utilities";
import {RequestWithTokenData, RequestWithUserSpace} from "../interfaces/auth.interface";
import axios from "axios";
import {encryptData} from "../config/rsaEncryption";
import {UpdateSpaceDTO} from "../dto/updateSpaceDTO"; // for manual validation

@injectable()
export class SpaceController {
    constructor (
        @inject("SpaceService")
        private spaceService: SpaceService,
    ) {
    }

    create = async (req: RequestWithTokenData, res: Response, next: NextFunction) => {
        try {
            // Transform plain object to class instance
            const spaceDTO: any = plainToInstance(CreateSpaceDto, req.body);

            // Validate the instance
            const validationErrors = await validate(spaceDTO);

            if (validationErrors.length > 0) {
                // Extract error messages for all fields
                const errorMessages = extractErrorMessages(validationErrors);
                return next(new HttpException(400, errorMessages));
            }

            // Call the service to create the space
            const { data, message, statusCode } = await this.spaceService.createSpace(req.tokenData, spaceDTO);

            // Send the response
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error);
        }
    }

    update = async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        try {
            if(!req.space) {
                next(new HttpException(404, "space not found"))
            }
            // Transform plain object to class instance
            const updatedSpaceDTO: any = plainToInstance(UpdateSpaceDTO, req.body);

            // Validate the instance
            const validationErrors = await validate(updatedSpaceDTO);

            if (validationErrors.length > 0) {
                // Extract error messages for all fields
                const errorMessages = extractErrorMessages(validationErrors);
                return next(new HttpException(400, errorMessages));
            }

            // Call the service to create the space
            const { data, message, statusCode } = await this.spaceService.updateSpace(req.space, updatedSpaceDTO);

            // Send the response
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error);
        }
    }

    getSpace = async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        try {
            if(!req.space) {
                next(new HttpException(404, "space not found"))
            }
            (req.space.category as any) = stringToArray(req.space.category);
            res.status(200).send({ data: req.space, message: "space details"})
        } catch(error: any) {
            next(error)
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.getAll();
            res.status(statusCode).send({ data, message})
        } catch(error: any) {
            next(error)
        }
    }

    uploadDocuments = async (req: RequestWithTokenData, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.uploadDocuments(req.tokenData, req, res);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    sentSpaceCreationLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Transform plain object to class instance
            const emailDTO: any = plainToInstance(EmailDto, req.body);
            // Validate the instance
            const validationErrors = await validate(emailDTO);

            if (validationErrors.length > 0) {
                // Extract error messages for all fields
                const errorMessages = extractErrorMessages(validationErrors);
                return next(new HttpException(400, errorMessages));
            }
            const response  = await axios.post(`${process.env.AUTH_API_END_POINT}/check-email`, {
                data: encryptData(emailDTO.email)
            })
            if(response.data.data) {
                next(new HttpException(400, "email already used"))
            }
            const {data, message, statusCode} = await this.spaceService.sentSpaceCreationLink(emailDTO.email);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    verifySpaceLink = async (req: RequestWithTokenData, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.verifySpaceLink(req.tokenData);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    addSpaceLinks = async (req: RequestWithTokenData, res: Response, next: NextFunction) => {
        try {
            const {link} = req.body;
            if (!link) {
                next(new HttpException(400, "invalid link"))
            }
            const {data, message, statusCode} = await this.spaceService.addSpaceLinks(req.tokenData, link);
            res.status(statusCode).send({ data, message})
        } catch(error: any) {
            next(error)
        }
    }

    addLogo = async (req: RequestWithTokenData, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.addLogo(req.tokenData, req, res);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    updateLogo = async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.updateLogo(req, res);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

    addBanner = async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.addBanner(req, res);
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
                 next(new HttpException(400, "invalid space id"))
            }
            if (!(type === 'APPROVED' || type === 'REJECTED')) {
                next(new HttpException(400, "invalid status type"))
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

    submitSpaceForm = async (req: RequestWithTokenData, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.spaceService.submitForm(req.tokenData);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error)
        }
    }

}