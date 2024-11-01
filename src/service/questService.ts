import { inject, injectable } from "tsyringe";
import { QuestRepository } from "../repository/questRepository";
import { CreateQuestDTO } from "../dto/createQuestDTO";
import { UpdateQuestDTO } from "../dto/updateQuestDTO";
import { HttpException } from "../exceptions/httpException";
import {
    QuestStatus,
    Quest,
    QuestApprovalStatus,
    SpaceStatus,
    QuestViewStatus,
    QuestTemplate,
    QuestCompletionStatus
} from "@prisma/client";
import { RequestWithTokenData } from "../interfaces/auth.interface";
import { stringToArray } from "../utils/utilities";
import {Request, Response} from "express";
import multer from "multer";
import {uploadFile} from "../config/multerConfig";
import {QuestParticipantsRepository} from "../repository/questParticipantsRepository";
import {QuestVoteRepository} from "../repository/questVoteRepository";
import {QuestQnaRepository} from "../repository/questQnaRepository";
import {transformToQuestQnADetails, transformToQuestVoteDetails} from "../interfaces/quest.interface";


@injectable()
export class QuestService {
    constructor(
        @inject("QuestRepository")
        private questRepository: QuestRepository,
        @inject("QuestParticipantsRepository")
        private questParticipantsRepository: QuestParticipantsRepository,
        @inject("QuestVoteRepository")
        private questVoteRepository: QuestVoteRepository,
        @inject("QuestQnaRepository")
        private questQnaRepository: QuestQnaRepository,
    ) {}

    // Create a new quest
    createQuest = async (spaceId: string, questDTO: CreateQuestDTO) => {
        // Check if a quest with the same title exists in the space
        const existingQuest = await this.questRepository.findQuestsBySpace(spaceId);
        if (existingQuest?.some(quest => quest.title === questDTO.title)) {
            throw new HttpException(409, "A quest with this title already exists in the space");
        }

        let newQuest;
        if (questDTO.template === QuestTemplate.QNA) {
            // Create a new qna quest
            newQuest = await this.questRepository.createQuestWithQNA(
                spaceId,
                questDTO
            );
        } else if (questDTO.template === QuestTemplate.VOTE) {
            // Create a new vote quest
            newQuest = await this.questRepository.createQuestWithVote(
                spaceId,
                questDTO
            );
        } else {
            throw new HttpException(400, "Only QNA, VOTE template supported")
        }
        return {
            statusCode: 201,
            message: "Quest created successfully",
            data: newQuest,
        };
    };

    // Fetch a quest by its ID
    findQuest = async (questId: string) => {
        const quest = await this.questRepository.findQuestByIdAndViewStatus(questId, QuestViewStatus.PUBLIC);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }
        return {
            statusCode: 200,
            message: "Quest details fetched successfully",
            data: quest,
        };
    };

    updateQuestVoteCount = async (user: any, questVoteId: string, optionId: string) => {
        const questVote: any = await this.questVoteRepository.findQuestVoteById(questVoteId);
        let questParticipant: any = await this.questParticipantsRepository.findParticipantByUserId(user.id);
        // quest template should be "VOTE"
        if (questVote.quest.template !== QuestTemplate.VOTE) {
            throw new HttpException(400, "Invalid Quest For This Action");
        }
        // quest attempt's check
        if (questParticipant && questParticipant.reattempt_count <= questVote.quest.reattempt) {
            throw new HttpException(400, "Attempt Over")
        }
        questParticipant = await this.questParticipantsRepository.updateParticipantStats(questVote.quest.id, user.id, QuestCompletionStatus.COMPLETED, true, new Date(), new Date(), questVote.quest.max_reward_point, questParticipant ? Number(questParticipant.reattempt_count) + 1 : 1, 0);
        const questVoteParticipant = await this.questVoteRepository.updateParticipantVoteByUserIdAndQuestVoteId(questVoteId, user.id, optionId);
        if (questVoteParticipant && questParticipant) {
            return {
                statusCode: 200,
                message: "Voted Successfully",
                data: questParticipant,
            };
        } else {
            return {
                statusCode: 400,
                message: "Something went wrong",
                data: "",
            };
        }
    }

    getQuestVoteById = async (questId: string) => {
        const quest: any = await this.questRepository.findQuestById(questId);
        if(!quest.questVote) {
            throw new HttpException(404, "quest voting article not found")
        }
        return {
            statusCode: 200,
            message: "Quest Vote Details",
            data: await transformToQuestVoteDetails(quest.questVote),
        };
    }

    getQnaQuestById = async (questId: string) => {
        const data: any = await this.questQnaRepository.findQuestQNAByQuestId(questId);
        const questQna = await transformToQuestQnADetails(data);
        return {
            statusCode: 200,
            message: "Quest Qna Details",
            data: questQna
        }
    }
    // Update a quest by ID
    updateQuest = async (questId: string, updateQuestDTO: UpdateQuestDTO) => {
        const quest = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }

        if (quest.approval_status === QuestApprovalStatus.APPROVED) {
            throw new HttpException(400, "Approved quests cannot be updated");
        }

        const updatedQuest = await this.questRepository.updateQuestById(questId, {
            ...updateQuestDTO,
        });

        return {
            statusCode: 200,
            message: "Quest updated successfully",
            data: updatedQuest,
        };
    };

    // Delete a quest by ID
    deleteQuest = async (questId: string) => {
        const quest = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }

        const deleted = await this.questRepository.deleteQuestById(questId);
        return {
            statusCode: 200,
            message: "Quest deleted successfully",
            data: deleted,
        };
    };

    // Find all quests for a specific space
    findQuestsBySpace = async (spaceId: string) => {
        const quests = await this.questRepository.findQuestsBySpaceAndQuestViewStatus(spaceId, QuestViewStatus.PUBLIC);
        if (!quests) {
            throw new HttpException(404, "No quests found for the specified space");
        }

        return {
            statusCode: 200,
            message: "Quests fetched successfully",
            data: quests,
        };
    };

    findAllQuests = async (page = 1, pageSize = 10, sortBy = 'created_at', sortOrder: 'asc' | 'desc' = 'desc') => {
        const { quests, totalCount } = await this.questRepository.findAll(page, pageSize, sortBy, sortOrder);

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            statusCode: 200,
            message: "Quests fetched successfully",
            data: quests,
            meta: {
                page,
                pageSize,
                totalCount,
                totalPages,
            },
        };
    }

    // Update quest status
    updateQuestStatus = async (questId: string, status: QuestStatus, schedule_time: Date | null) => {
        const quest = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }

        if (quest.status === status) {
            throw new HttpException(400, "Quest is already in the specified status");
        }
        const updatedQuest = await this.questRepository.updateQuestStatusById(questId, status, schedule_time);
        return {
            statusCode: 200,
            message: `Quest status updated to ${status}`,
            data: updatedQuest,
        };
    };

    publishQuest = async (questId: string, status: QuestStatus, schedule_time: Date | null) => {
        const quest = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }

        if (quest.status === status) {
            throw new HttpException(400, "Quest is already in the specified status");
        }
        await this.questRepository.updateQuestStatusById(questId, status, schedule_time);
        const updatedQuest = await this.questRepository.updateApprovalStatus(questId, QuestApprovalStatus.REVIEW, "");
        return {
            statusCode: 200,
            message: `Quest Published`,
            data: updatedQuest,
        };
    };

    // Submit quest for approval
    submitQuestForApproval = async (questId: string, type: string, reject_reason: string) => {
        const quest = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }

        if (quest.approval_status !== QuestApprovalStatus.REVIEW) {
            throw new HttpException(400, "Only quests in review status can be submitted for approval");
        }
        const status = QuestApprovalStatus[type as keyof typeof QuestApprovalStatus];
        const updatedQuest = await this.questRepository.updateApprovalStatus(questId, status, reject_reason);

        return {
            statusCode: 200,
            message: "Quest submitted for approval",
            data: updatedQuest,
        };
    };

    toggleView = async (questId: string) => {
        const quest: any = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }
        let updateQuest;
        if (quest.view_status === QuestViewStatus.PUBLIC) {
            updateQuest = await this.questRepository.toggleViewStatusById(questId, QuestViewStatus.PRIVATE);
        } else {
            updateQuest = await this.questRepository.toggleViewStatusById(questId, QuestViewStatus.PUBLIC);
        }
        return {
            statusCode: 200,
            message: `toggle to ${updateQuest.view_status}`,
            data: updateQuest,
        };
    }

    uploadMedia = async (req: Request, res: Response) => {
        // await new Promise<void>((resolve, reject) => {
        //     // Using multer middleware to handle single file upload
        //     uploadFile.single('file')(req, res, (err: any) => {
        //         if (err) {
        //             return reject(new HttpException(500, 'Server error during file upload'));
        //         }
        //         if (!req.file) {
        //             return reject(new HttpException(400, 'No file uploaded'));
        //         }
        //         resolve();
        //     });
        // });

        // Extract file information from req.file
        const fileInfo = {
            filename: req.file?.originalname,
            path: `${process.env.SERVER_URL}${req.file?.destination}${req.file?.filename}`,
        };

        return {
            statusCode: 200,
            message: 'File uploaded successfully',
            data: fileInfo,
        };
    }
}
