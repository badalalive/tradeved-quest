import { inject, injectable } from "tsyringe";
import { QuestRepository } from "../repository/questRepository";
import { CreateQuestDTO } from "../dto/createQuestDTO";
import { UpdateQuestDTO } from "../dto/updateQuestDTO";
import { HttpException } from "../exceptions/httpException";
import {QuestStatus, Quest, QuestApprovalStatus, SpaceStatus, QuestViewStatus} from "@prisma/client";
import { RequestWithTokenData } from "../interfaces/auth.interface";
import { stringToArray } from "../utils/utilities";

@injectable()
export class QuestService {
    constructor(
        @inject("QuestRepository")
        private questRepository: QuestRepository,
    ) {}

    // Create a new quest
    createQuest = async (spaceId: string, questDTO: CreateQuestDTO) => {
        if (questDTO.participant_limit <= 0) {
            throw new HttpException(400, "Participant limit must be greater than zero");
        }

        // Check if a quest with the same title exists in the space
        const existingQuest = await this.questRepository.findQuestsBySpace(spaceId);
        if (existingQuest?.some(quest => quest.title === questDTO.title)) {
            throw new HttpException(409, "A quest with this title already exists in the space");
        }

        // Create a new quest
        const newQuest = await this.questRepository.createQuest({
            ...questDTO,
            created_by: spaceId,
            updated_by: spaceId,
        });

        return {
            statusCode: 201,
            message: "Quest created successfully",
            data: newQuest,
        };
    };

    // Fetch a quest by its ID
    getQuest = async (questId: string) => {
        const quest = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }
        return {
            statusCode: 200,
            message: "Quest details fetched successfully",
            data: quest,
        };
    };

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
        const quests = await this.questRepository.findQuestsBySpace(spaceId);
        if (!quests) {
            throw new HttpException(404, "No quests found for the specified space");
        }

        return {
            statusCode: 200,
            message: "Quests fetched successfully",
            data: quests,
        };
    };


    // Update quest status
    updateQuestStatus = async (questId: string, status: QuestStatus) => {
        const quest = await this.questRepository.findQuestById(questId);
        if (!quest) {
            throw new HttpException(404, "Quest not found");
        }

        if (quest.status === status) {
            throw new HttpException(400, "Quest is already in the specified status");
        }

        const updatedQuest = await this.questRepository.updateQuestById(questId, { status });
        return {
            statusCode: 200,
            message: `Quest status updated to ${status}`,
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
        const updatedQuest = await this.questRepository.updateQuestById(questId,
              {
                  approval_status: status,
                  reject_reason: reject_reason
              }
        );

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

}
