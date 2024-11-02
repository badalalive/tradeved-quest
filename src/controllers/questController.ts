import {NextFunction, Request, Response} from "express";
import { injectable, inject } from "tsyringe";
import { UpdateQuestDTO } from "../dto/updateQuestDTO";
import { CreateQuestDTO } from "../dto/createQuestDTO";
import {QuestCategory, QuestStatus} from "@prisma/client";
import {QuestService} from "../service/questService";
import {HttpException} from "../exceptions/httpException";
import {RequestWithUser, RequestWithUserSpace} from "../interfaces/auth.interface";
import moment from 'moment';
import {plainToInstance} from "class-transformer";
import {CreateSpaceDto} from "../dto/spaceDTO";
import {validate} from "class-validator";
import {extractErrorMessages} from "../utils/utilities";
import {QuestionOptionDTO, QuestQuestionsWithSelectedOptionsDTO} from "../dto/questQuestionOptionDTO";

@injectable()
export class QuestController {
    constructor(
        @inject("QuestService")
        private questService: QuestService
    ) {}

    // Create a new quest
    createQuest = async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        try {
            if(!req.space) {
                next(new HttpException(400, "invalid space"))
            }
            const spaceId = req.space.id;
            const questDTO: any = plainToInstance(CreateQuestDTO, req.body);
            const validationErrors = await validate(questDTO);

            if (validationErrors.length > 0) {
                // Extract error messages for all fields
                const errorMessages = extractErrorMessages(validationErrors);
                return next(new HttpException(400, errorMessages));
            }

            if (questDTO.category === QuestCategory.TIMED && !questDTO.quest_time) {
                next(new HttpException(400, "Quest time is required for timed quests"));
            }
            const {data, message, statusCode} = await this.questService.createQuest(spaceId, questDTO);
            // Send the response
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    // Get quest by ID
    findQuest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            const {data, message, statusCode} = await this.questService.findQuest(questId);
            // Send the response
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error)
        }
    };

    voteQuest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const questId =  req.params.id;
            const optionId =  req.params.optionId;
            const user = req.user;
            if (!optionId || !questId || !user) {
                next(new HttpException(400, "invalid params"))
            }
            const {data, message, statusCode} = await this.questService.updateQuestVoteCount(user, questId, optionId);
            res.status(statusCode).send({data, message});
        } catch (error: any) {
            next(error)
        }
    }

    findVoteQuestById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const questId =  req.params.id;
            if(!questId) {
                next(new HttpException(400, "invalid params"))
            }
            const {data, message, statusCode} = await this.questService.findQuestVoteById(questId);
            res.status(statusCode).send({data, message});
        } catch (error: any) {
            next(error)
        }
    }

    findQnaQuestById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const questId =  req.params.id;
            if(!questId) {
                next(new HttpException(400, "invalid params"))
            }
            const {data, message, statusCode} = await this.questService.findQnaQuestById(questId);
            res.status(statusCode).send({data, message});
        } catch (error: any) {
            next(error)
        }
    }

    checkAnswerByQuestionId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const questId =  req.params.questId;
            if(!questId) {
                next(new HttpException(400, "invalid params"))
            }
            const questQuestionOptionsDTO: any = plainToInstance(QuestQuestionsWithSelectedOptionsDTO, req.body);
            const validationErrors = await validate(questQuestionOptionsDTO);

            if (validationErrors.length > 0) {
                // Extract error messages for all fields
                const errorMessages = extractErrorMessages(validationErrors);
                return next(new HttpException(400, errorMessages));
            }
            const {data, message, statusCode} = await this.questService.findAnswerByQuestionId(req.user, questId, questQuestionOptionsDTO);
            res.status(statusCode).send({data, message});
        } catch (error: any) {
            next(error)
        }
    }
    submitQuestionAnswer = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const questQuestionOptionsDTO: any = plainToInstance(QuestQuestionsWithSelectedOptionsDTO, req.body);
            const validationErrors = await validate(questQuestionOptionsDTO);

            if (validationErrors.length > 0) {
                // Extract error messages for all fields
                const errorMessages = extractErrorMessages(validationErrors);
                return next(new HttpException(400, errorMessages));
            }
            const {data, message, statusCode} = await this.questService.submitQuestionAnswer(questQuestionOptionsDTO);
            res.status(statusCode).send({data, message});
        } catch(error: any) {
            next(error)
        }
    }

    // Update a quest by ID
    updateQuest = async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            if (!questId) {
                next(new HttpException(400, "invalid quest id"))
            }
            const updateQuestDTO = req.body as UpdateQuestDTO;
            updateQuestDTO.updated_by = req.user.id;
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
    findQuestsBySpace = async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        try {
            if(!req.space) {
                next(new HttpException(400, "invalid space"))
            }
            const spaceId = req.space.id;
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
                return next(new HttpException(400, "Invalid quest ID"));
            }

            const status = req.body.status as QuestStatus;
            let schedule_time: any = req.body.schedule_time ? moment(req.body.schedule_time) : null;
            // Validate status as a valid enum value
            if (!Object.values(QuestStatus).includes(status)) {
                return next(new HttpException(400, "Invalid status value"));
            }
            // Validate schedule_time when status is SCHEDULED
            if (status === QuestStatus.SCHEDULED) {
                if (!schedule_time || !schedule_time.isValid() || !schedule_time.isAfter(moment())) {
                    return next(new HttpException(400, "Invalid or missing schedule time. It must be a future date."));
                }
                schedule_time = schedule_time.toDate();
            } else {
                schedule_time = null
            }
            const { data, message, statusCode } = await this.questService.updateQuestStatus(questId, status, schedule_time);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error);
        }
    };

    publishQuest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questId = req.params.id;
            if (!questId) {
                return next(new HttpException(400, "Invalid quest ID"));
            }

            const status = req.body.status as QuestStatus;
            let schedule_time: any = req.body.schedule_time ? moment(req.body.schedule_time) : null;

            // Validate status as a valid enum value
            if (!(status === QuestStatus.PUBLISH || status === QuestStatus.SCHEDULED)) {
                return next(new HttpException(400, "Invalid status value"));
            }
            // Validate schedule_time when status is SCHEDULED
            if (status === QuestStatus.SCHEDULED) {
                if (!schedule_time || !schedule_time.isValid() || !schedule_time.isAfter(moment())) {
                    return next(new HttpException(400, "Invalid or missing schedule time. It must be a future date."));
                }
                schedule_time = schedule_time.toDate();
            } else {
                schedule_time = null
            }
            const { data, message, statusCode } = await this.questService.publishQuest(questId, status, schedule_time);
            res.status(statusCode).send({ data, message });
        } catch (error: any) {
            next(error);
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