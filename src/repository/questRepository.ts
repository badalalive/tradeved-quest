import {inject, injectable} from "tsyringe";
import {PrismaClient, Quest, QuestApprovalStatus, QuestionStatus, QuestStatus, QuestViewStatus} from "@prisma/client";
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
                questParticipant: true,
                questVote: true,
                questQNA: true,
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
    async findQuestByIdAndViewStatus(questId: string, view_status: QuestViewStatus): Promise<Quest | null> {
        await this.prismaClient.$connect();

        const quest = await this.prismaClient.quest.findUnique({
            where: { id: questId, view_status},
            include: {
                space: true,
                questParticipant: true,
                questVote: true,
                questQNA: true,
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
    async createQuest(spaceId: string, data: CreateQuestDTO): Promise<Quest | null> {
        await this.prismaClient.$connect();

        const newQuest = await this.prismaClient.quest.create({
            data: {
                title: data.title,
                description: data.description,
                space_id: spaceId,
                participant_limit: data.participant_limit,
                max_reward_point: data.max_reward_point,
                end_date: data.end_date || null,
                reattempt: data.reattempt,
                status: QuestStatus.DRAFTED,
                category: data.category,
                view_status: data.view_status,
                quest_time: data.quest_time,
                created_by: spaceId,
                updated_by: spaceId,
                template: data.template,
                content: data.content,
                content_type: data.content_type
            },
        });

        await this.prismaClient.$disconnect();
        return newQuest;
    }

    // Create a quest with QNA Template
    async createQuestWithQNA(spaceId: string, data: CreateQuestDTO): Promise<Quest | null> {
        await this.prismaClient.$connect();

        const result = await this.prismaClient.$transaction(async (prisma) => {
            // Create the quest
            const newQuest: any = await prisma.quest.create({
                data: {
                    title: data.title,
                    description: data.description,
                    logo_url: data.logo_url,
                    space_id: spaceId,
                    participant_limit: data.participant_limit,
                    max_reward_point: data.max_reward_point,
                    end_date: data.end_date || null,
                    reattempt: data.reattempt,
                    status: QuestStatus.DRAFTED,
                    category: data.category,
                    view_status: data.view_status,
                    quest_time: data.quest_time,
                    created_by: spaceId,
                    updated_by: spaceId,
                    template: data.template,
                    content: data.content,
                    content_type: data.content_type,
                },
            });

            // Create QNA with questions and options if questQNA is provided
            if (data.questQNA) {
                // Create the QuestQNA record first
                const questQNA: any = await prisma.questQNA.create({
                    data: {
                        questId: newQuest.id, // Link to the new quest
                        total_question: data.questQNA.length,
                    },
                });

                // Create the questions and options
                await Promise.all(data.questQNA.map(async (questionData) => {
                    // Create the question
                    const question: any = await prisma.question.create({
                        data: {
                            question: questionData.questionText,
                            description: questionData.description,
                            answer_type: questionData.answerType,
                        },
                    });

                    // Create options for the question
                    await Promise.all(questionData.options.map(async (option) => {
                        const createdOption: any = await prisma.option.create({
                            data: {
                                content: option.content,
                                description: option.description,
                                questionId: question.id, // link the option to the question
                            },
                        });

                        // Create an answer if the option is correct
                        if (option.isCorrectAnswer) {
                            await prisma.answer.create({
                                data: {
                                    questionId: question.id,
                                    optionId: createdOption.id,
                                },
                            });
                        }
                    }));

                    // Create the questQNAQuestion linking to the created question and the new questQNA
                    await prisma.questQNAQuestion.create({
                        data: {
                            questQna: {
                                connect: { id: questQNA.id }, // Link to the created QuestQNA
                            },
                            question: {
                                connect: { id: question.id }, // Link to the created question
                            },
                            question_status: QuestionStatus.UNATTEMPTED,
                        },
                    });
                }));
            }

            // Fetch the new quest including the related records
            return prisma.quest.findUnique({
                where: {id: newQuest.id},
                include: {
                    questQNA: {
                        include: {
                            questQNAQuestion: {
                                include: {
                                    question: {
                                        include: {
                                            options: true,
                                            answer: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }); // Return the complete quest with all relationships
        });

        await this.prismaClient.$disconnect();
        return result;
    }

    // Create a quest with VOTE Template
    async createQuestWithVote(spaceId: string, data: CreateQuestDTO): Promise<Quest | null> {
        await this.prismaClient.$connect();

        const result = await this.prismaClient.$transaction(async (prisma) => {
            // Create the quest
            const newQuest: any = await prisma.quest.create({
                data: {
                    title: data.title,
                    description: data.description,
                    logo_url: data.logo_url,
                    content: data.content,
                    content_type: data.content_type,
                    space_id: spaceId,
                    participant_limit: data.participant_limit,
                    max_reward_point: data.max_reward_point,
                    end_date: data.end_date || null,
                    reattempt: data.reattempt,
                    status: QuestStatus.DRAFTED,
                    category: data.category,
                    view_status: data.view_status,
                    quest_time: data.quest_time,
                    created_by: data.created_by || spaceId,
                    updated_by: data.updated_by || spaceId,
                    template: data.template,
                },
            });

            // Create QuestVote record if questVote is provided
            if (data.questVote && data.questVote.length > 0) {
                await Promise.all(data.questVote.map(async (voteData) => {
                    const questVote: any = await prisma.questVote.create({
                        data: {
                            quest_id: newQuest.id,
                            news_item: voteData.news_item,
                        },
                    });

                    // Create QuestVoteOptions if options are provided in questVote
                    if (voteData.options && voteData.options.length > 0) {
                        await Promise.all(voteData.options.map(async (optionData) => {
                            await prisma.questVoteOption.create({
                                data: {
                                    quest_vote_id: questVote.id,
                                    option_text: optionData.option_text,
                                },
                            });
                        }));
                    }
                }));
            }

            // Fetch the complete quest with related vote data for verification
            return prisma.quest.findUnique({
                where: { id: newQuest.id },
                include: {
                    questVote: {
                        include: {
                            questVoteOptions: true,
                        },
                    },
                },
            });
        });

        await this.prismaClient.$disconnect();
        return result;
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

    async updateApprovalStatus(questId: string, approval_status: QuestApprovalStatus, reject_reason: string): Promise<Quest> {
        await this.prismaClient.$connect();
        const quest = await this.prismaClient.quest.update({
            where: {
                id: questId
            },
            data: {
                approval_status: approval_status,
                reject_reason: reject_reason
            }
        })
        await this.prismaClient.$disconnect();
        return quest;
    }

    async updateQuestStatusById(questId: string, status: QuestStatus, schedule_time: Date | null): Promise<Quest> {
        await this.prismaClient.$connect();
        const quest = await this.prismaClient.quest.update({
            where: {
                id: questId
            }, data: {
                status: status,
                schedule_time: schedule_time
            }
        })
        await this.prismaClient.$disconnect();
        return quest;
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
    async findQuestsBySpaceAndQuestViewStatus(spaceId: string, view_status: QuestViewStatus): Promise<Quest[] | null> {
        await this.prismaClient.$connect();

        const quests = await this.prismaClient.quest.findMany({
            where: { space_id: spaceId, view_status: view_status },
            include: {
                moduleQuests: true,
                questParticipant: true
            }
        });

        await this.prismaClient.$disconnect();
        return quests;
    }

    // Find All quests
    async findAll(page: number, pageSize: number, sortBy: string, sortOrder: 'asc' | 'desc'): Promise<{ quests: Quest[], totalCount: number }> {
        await this.prismaClient.$connect();

        // Fetch total count of records for pagination calculation
        const totalCount = await this.prismaClient.quest.count();

        // Fetch paginated data with dynamic sorting
        const quests = await this.prismaClient.quest.findMany({
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        await this.prismaClient.$disconnect();

        return { quests, totalCount };
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
