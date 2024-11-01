import {inject, injectable} from "tsyringe";
import {PrismaClient, QuestCompletionStatus, QuestParticipant} from "@prisma/client";

@injectable()
export class QuestParticipantsRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {}

    // add quest participants
    async createParticipantToQuest(questId: string, participantId: string): Promise<QuestParticipant | null> {
        await this.prismaClient.$connect();

        const newParticipant = await this.prismaClient.questParticipant.create({
            data: {
                quest_id: questId,
                participant_id: participantId,
                completion_status: QuestCompletionStatus.NOT_STARTED,
                joined_at: new Date()
            },
        });

        await this.prismaClient.$disconnect();
        return newParticipant;
    }

    // update quest participants
    async updateParticipantStats(
        questId: string,
        participantId: string,
        status: QuestCompletionStatus,
        reward_collected: boolean,
        joined_at: Date,
        completed_at: Date,
        reward_points: number,
        reattempt_count: number,
        score?: number
    ): Promise<any> {
        await this.prismaClient.$connect();

        const updatedParticipant = await this.prismaClient.questParticipant.upsert({
            where: {
                quest_id_participant_id: {
                    quest_id: questId,
                    participant_id: participantId,
                },
            },
            update: {
                score: score,
                completion_status: status,
                reward_collected: reward_collected,
                reward_points: reward_points,
                completed_at: completed_at,
                reattempt_count: reattempt_count
            },
            create: {
                quest_id: questId,
                participant_id: participantId,
                score: score,
                completion_status: status,
                reward_collected: reward_collected,
                reward_points: reward_points,
                joined_at: joined_at,
                completed_at: completed_at,
            },
        });

        await this.prismaClient.$disconnect();
        return updatedParticipant;
    }

    async findParticipantByUserId(userId: string): Promise<QuestParticipant | null> {
        await this.prismaClient.$connect();
        const questParticipant = await this.prismaClient.questParticipant.findUnique( {
            where: {
                id: userId
            }
        })
        await this.prismaClient.$disconnect();
        return questParticipant;
    }

}