import {inject, injectable} from "tsyringe";
import {PrismaClient, QuestCompletionStatus, QuestParticipant} from "@prisma/client";

@injectable()
export class QuestParticipantsRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {}

    // add quest participants
    async addParticipantToQuest(questId: string, participantId: string): Promise<QuestParticipant | null> {
        await this.prismaClient.$connect();

        const newParticipant = await this.prismaClient.questParticipant.create({
            data: {
                quest_id: questId,
                participant_id: participantId,
                completion_status: "NOT_STARTED",
                joined_at: new Date()
            },
        });

        await this.prismaClient.$disconnect();
        return newParticipant;
    }

    // update quest participants
    async updateParticipantStatus(questId: string, participantId: string, status: string, reward_collected: boolean, reattempt_count: number, completed_at: Date, reward_points: number, score?: number): Promise<boolean> {
        await this.prismaClient.$connect();

        const updatedParticipant = await this.prismaClient.questParticipant.updateMany({
            where: {
                quest_id: questId,
                participant_id: participantId,
            },
            data: {
                score: score,
                completion_status: status as QuestCompletionStatus,
                reattempt_count: reattempt_count,
                reward_collected: reward_collected,
                reward_points: reward_points,
                completed_at: completed_at
            },
        });

        await this.prismaClient.$disconnect();
        return !!updatedParticipant;
    }


}