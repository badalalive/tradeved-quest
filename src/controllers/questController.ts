import {NextFunction, Request, Response} from "express";
import { injectable, inject } from "tsyringe";
import { UpdateQuestDTO } from "../dto/updateQuestDTO";
import { CreateQuestDTO } from "../dto/createQuestDTO";
import { QuestStatus } from "@prisma/client";
import {QuestService} from "../service/questService";
import {HttpException} from "../exceptions/httpException";

@injectable()
export class QuestController {
    constructor(
        @inject("QuestService")
        private questService: QuestService
    ) {}

    // Create a new quest
    createQuest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spaceId = req.params.spaceId;
            const questDTO = req.body as CreateQuestDTO;
            const {data, message, statusCode} = await this.questService.createQuest(spaceId, questDTO);
            // Send the response
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    // Get quest by ID
    getQuest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            const {data, message, statusCode} = await this.questService.getQuest(questId);
            // Send the response
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    // Update a quest by ID
    updateQuest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            if (!questId) {
                next(new HttpException(400, "invalid quest id"))
            }
            const updateQuestDTO = req.body as UpdateQuestDTO;
            const {data, message, statusCode} = await this.questService.updateQuest(questId, updateQuestDTO);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    // Delete a quest by ID
    deleteQuest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            if (!questId) {
                next(new HttpException(400, "invalid quest id"))
            }
            const {data, message, statusCode} = await this.questService.deleteQuest(questId);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    // Find all quests for a specific space
    findQuestsBySpace = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const spaceId = req.params.spaceId;
            if (!spaceId) {
                next(new HttpException(400, "invalid space id"))
            }
            const {data, message, statusCode} = await this.questService.findQuestsBySpace(spaceId);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
            const sortBy = (req.query.sortBy as string) || 'created_at';
            const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
            const { data, message, statusCode, meta } = await this.questService.findAllQuests(page, pageSize, sortBy, sortOrder);
            res.status(statusCode).send({ data, message, meta });
        } catch (error: any) {
            next(error)
        }
    }


    // Update quest status
    updateQuestStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            if (!questId) {
                next(new HttpException(400, "invalid quest id"))
            }
            const status = req.body.status as QuestStatus;
            const {data, message, statusCode} = await this.questService.updateQuestStatus(questId, status);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    // Submit quest for approval
    submitQuestForApproval = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            const type = req.params.type;
            let reject_reason = req.body.reject_reason;
            if (!questId) {
                next(new HttpException(400, "invalid quest id"))
            }
            if (!(type === 'APPROVED' || type === 'REJECTED')) {
                next(new HttpException(400, "invalid status type"))
            }
            if (type === 'APPROVED') {
                reject_reason = "";
            }
            const {data, message, statusCode} = await this.questService.submitQuestForApproval(questId, type, reject_reason);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    toggleView = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            const {data, message, statusCode} = await this.questService.toggleView(questId);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error);
        }
    }

    uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {data, message, statusCode} = await this.questService.uploadMedia(req, res);
            res.status(statusCode).send({ data, message})
        } catch (error: any) {
            next(error);
        }
    }

}