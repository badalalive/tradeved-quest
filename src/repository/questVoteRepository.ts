import {inject, injectable} from "tsyringe";
import {PrismaClient, QuestParticipantVote, QuestVote} from "@prisma/client";

@injectable()
export class QuestVoteRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {}

    async updateParticipantVoteByUserIdAndQuestVoteId(
        questVoteId: string,
        userId: string,
        optionId: string
    ): Promise<boolean> {
        await this.prismaClient.$connect();

        const result = await this.prismaClient.$transaction(async (prisma) => {
            // Step 1: Retrieve the current vote status of the participant
            const existingVote: any = await prisma.questParticipantVote.findUnique({
                where: {
                    // Assuming a unique constraint on the combination of quest_vote_id and participant_id
                    quest_vote_id_participant_id: {
                        quest_vote_id: questVoteId,
                        participant_id: userId,
                    },
                },
            });

            // Step 2: Upsert the QuestParticipantVote record
            const upsertedParticipantVote = await prisma.questParticipantVote.upsert({
                where: {
                    quest_vote_id_participant_id: {
                        quest_vote_id: questVoteId,
                        participant_id: userId,
                    },
                },
                create: {
                    quest_vote_id: questVoteId,
                    participant_id: userId,
                    option_id: optionId,
                    voted: true,
                },
                update: {
                    option_id: optionId,
                    voted: true,
                },
            });

            // Step 3: Check if the participant had not voted yet
            if (!existingVote || !existingVote.voted) {
                // Step 4: Increment the vote_count for the selected option in QuestVoteOption
                const updatedVoteOption = await prisma.questVoteOption.update({
                    where: { id: optionId },
                    data: {
                        vote_count: {
                            increment: 1,
                        },
                    },
                });
            }
            return true;
        });

        await this.prismaClient.$disconnect();
        return result;
    }

    async findQuestVoteById(questVoteId: string): Promise<QuestVote | null> {
        await this.prismaClient.$connect();
        const questVote = await this.prismaClient.questVote.findUnique({
            where: {
                id: questVoteId
            }, include: {
                quest: true,
                questVoteOptions: {
                    select: {
                        id: true,
                        option_text: true,
                        vote_count: true,
                    }
                }
            }
        })
        await this.prismaClient.$disconnect();
        return questVote;
    }
}