import {inject, injectable} from "tsyringe";
import {QuestModuleService} from "../service/questModuleService";
import {NextFunction, Request, Response} from "express";
import {HttpException} from "../exceptions/httpException";
import {RequestWithUser} from "../interfaces/auth.interface";

@injectable()
export class QuestModuleController {
    constructor(
        @inject("QuestModuleService")
        private questModuleService: QuestModuleService
    ) {}

    create = async (req: RequestWithUser, res: Response, next: NextFunction)=> {
        try {
            const { title, description, background_color} = req.body
            if (!title || !description || !background_color) {
                new HttpException(400, "invalid request body")
            }
            const {data, message, statusCode} = await this.questModuleService.create(req.user.id, title, description, background_color);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    }

    update = async (req: RequestWithUser, res: Response, next: NextFunction)=> {
        try {
            const questModuleId = req.params.id;
            const { title, description, background_color } = req.body;
            const updated_by = req.user.id;
            const updateData: Partial<{
                title: string;
                description: string;
                background_color: string;
                image_url: string;
                updated_by: string;
            }> = {
                ...(title && { title }),
                ...(description && { description }),
                ...(background_color && { background_color }),
                ...(updated_by && { updated_by }),
            };
            const {data, message, statusCode} = await this.questModuleService.update(questModuleId, updateData);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    }

    addQuests = async (req: Request, res: Response, next: NextFunction)=> {
        try {
            const {questIds, moduleIds, orders} = req.body;
            if (!questIds || !moduleIds || !orders) {
                new HttpException(400, "invalid request body");
            }
            if (questIds.length !== moduleIds.length || questIds.length !== orders.length) {
                 new HttpException(400, "The lengths of questIds, moduleIds, and orders must be the same");
            }
            // Create data for each quest-module pair with its specific order
            const moduleQuests = questIds.map((questId: string, index: number) => ({
                quest_id: questId,
                module_id: moduleIds[index],
                order: orders[index],
            }));
            const {data, statusCode, message} = await this.questModuleService.addQuests(moduleQuests)
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    }

    removeQuests = async (req: Request, res: Response, next: NextFunction)=> {
        try {
            const {questIds, moduleIds} = req.body;
            if (!questIds || !moduleIds) {
                new HttpException(400, "invalid request body");
            }
            if (questIds.length !== moduleIds.length) {
                new HttpException(400, "The lengths of questIds, moduleIds must be the same");
            }
            const {data, statusCode, message} = await this.questModuleService.removeQuests(questIds, moduleIds)
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    }
}