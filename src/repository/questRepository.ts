import {inject, injectable} from "tsyringe";
import {PrismaClient, Quest, QuestViewStatus} from "@prisma/client";
import {CreateQuestDTO} from "../dto/createQuestDTO";
import {UpdateQuestDTO} from "../dto/updateQuestDTO";

@injectable()
export class QuestRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {}

    // Find a quest by its ID
    async findQuestById(questId: string): Promise<Quest | null> {
        await this.prismaClient.$connect();

        const quest = await this.prismaClient.quest.findUnique({
            where: { id: questId },
            include: {
                space: true,
                template: true,
                questParticipant: true,
                questVote: true,
                questVoteDiscussion: true,
                moduleQuests: {
                    include: {
                        module: true
                    }
                }
            }
        });

        await this.prismaClient.$disconnect();
        return quest;
    }

    // Create a new quest
    async createQuest(data: CreateQuestDTO): Promise<Quest | null> {
        await this.prismaClient.$connect();

        const newQuest = await this.prismaClient.quest.create({
            data: {
                title: data.title,
                description: data.description,
                space_id: data.space_id,
                participant_limit: data.participant_limit,
                max_reward_point: data.max_reward_point,
                end_date: data.end_date,
                reattempt: data.reattempt,
                status: data.status,
                category: data.category,
                quest_time: data.quest_time,
                created_by: data.space_id,
                updated_by: data.space_id,
                template_id: data.template_id
            },
        });

        await this.prismaClient.$disconnect();
        return newQuest;
    }

    // Update an existing quest by its ID
    async updateQuestById(questId: string, updateData: Partial<UpdateQuestDTO>): Promise<Quest | null> {
        await this.prismaClient.$connect();

        const updatedQuest = await this.prismaClient.quest.update({
            where: { id: questId },
            data: {
                ...updateData,
                updated_at: new Date() // Update the updated_at timestamp
            }
        });

        await this.prismaClient.$disconnect();
        return updatedQuest;
    }
    async toggleViewStatusById(questId: string, viewStatus: QuestViewStatus): Promise<Quest> {
        await this.prismaClient.$connect();

        const updatedQuest = await this.prismaClient.quest.update({
            where: { id: questId },
            data: {
                view_status: viewStatus,
                updated_at: new Date() // Update the updated_at timestamp
            }
        });

        await this.prismaClient.$disconnect();
        return updatedQuest;
    }

    // Find all quests for a specific space
    async findQuestsBySpace(spaceId: string): Promise<Quest[] | null> {
        await this.prismaClient.$connect();

        const quests = await this.prismaClient.quest.findMany({
            where: { space_id: spaceId },
            include: {
                moduleQuests: true,
                questParticipant: true
            }
        });

        await this.prismaClient.$disconnect();
        return quests;
    }

    // Delete a quest by its ID
    async deleteQuestById(questId: string): Promise<boolean> {
        await this.prismaClient.$connect();

        const deleteQuest = await this.prismaClient.quest.delete({
            where: { id: questId },
        });

        await this.prismaClient.$disconnect();
        return !!deleteQuest;
    }

}
