import {inject, injectable} from "tsyringe";
import {
    PrismaClient,
    QuestQNA,
    QuestQNAQuestion,
    Question,
    AnswerType,
    Option,
    Answer,
    QuestionStatus
} from "@prisma/client";
import {QuestQNAQuestionDTO} from "../dto/createQuestQNADTO";

@injectable()
export class QuestQnaRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {}

    async createQuestQNAWithQuestionsAndOptions(
        questId: string,
        questionsData: QuestQNAQuestionDTO[]
    ) {
        await this.prismaClient.$connect();

        const questQNA = await this.prismaClient.questQNA.create({
            data: {
                questId: questId,
                total_question: questionsData.length,
                questQNAQuestion: {
                    create: await Promise.all(questionsData.map(async (questionData) => {
                        const question: any = await this.prismaClient.question.create({
                            data: {
                                question: questionData.questionText,
                                description: questionData.description,
                                answer_type: questionData.answerType,
                                // Optionally, other fields can be included
                            },
                        });

                        const optionsData = questionData.options.map(async (option) => {
                            const createdOption: any = await this.prismaClient.option.create({
                                data: {
                                    content: option.content,
                                    questionId: question.id, // link the option to the question
                                },
                            });

                            // Create answer if this option is correct
                            if (option.isCorrectAnswer) {
                                await this.prismaClient.answer.create({
                                    data: {
                                        questionId: question.id,
                                        optionId: createdOption.id,
                                    },
                                });
                            }

                            return createdOption;
                        });

                        await Promise.all(optionsData); // wait for all options to be created

                        return {
                            question: {
                                connect: { id: question.id }, // Connect the newly created question
                            },
                            question_status: QuestionStatus.UNATTEMPTED,
                        };
                    })),
                },
            },
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
        });

        await this.prismaClient.$disconnect();
        return questQNA;
    }


    async createQuestQNA(questId: string, totalQuestions: number): Promise<QuestQNA> {
        await this.prismaClient.$connect();

        const newQuestQNA = await this.prismaClient.questQNA.create({
            data: {
                questId,
                total_question: totalQuestions,
            },
        });

        await this.prismaClient.$disconnect();
        return newQuestQNA;
    }

    async createQuestionToQNA(questQNAId: string, questionId: string): Promise<QuestQNAQuestion> {
        await this.prismaClient.$connect();

        const newQuestQNAQuestion = await this.prismaClient.questQNAQuestion.create({
            data: {
                questQna_id: questQNAId,
                questionId,
            },
        });

        await this.prismaClient.$disconnect();
        return newQuestQNAQuestion;
    }

    async findQuestQNAByQuestId(questId: string): Promise<QuestQNA | null> {
        await this.prismaClient.$connect();

        const questQNA = await this.prismaClient.questQNA.findUnique({
            where: { questId },
            include: {
                quest: true,
                questQNAQuestion: {
                    include: {
                        question: {
                            include: {
                                options: true
                            }
                        }, // Include related question data
                    },
                },
            },
        });

        await this.prismaClient.$disconnect();
        return questQNA;
    }

    async updateTotalQuestions(questQNAId: string, totalQuestions: number): Promise<QuestQNA | null> {
        await this.prismaClient.$connect();

        const updatedQuestQNA = await this.prismaClient.questQNA.update({
            where: { id: questQNAId },
            data: { total_question: totalQuestions },
        });

        await this.prismaClient.$disconnect();
        return updatedQuestQNA;
    }

    async findAllQuestionsForQNA(questQNAId: string): Promise<QuestQNAQuestion[]> {
        await this.prismaClient.$connect();

        const questions = await this.prismaClient.questQNAQuestion.findMany({
            where: { questQna_id: questQNAId },
            include: {
                question: true, // Include related question data
            },
        });

        await this.prismaClient.$disconnect();
        return questions;
    }

    async createQuestion(questionText: string, answerType: AnswerType): Promise<Question> {
        await this.prismaClient.$connect();

        const newQuestion = await this.prismaClient.question.create({
            data: {
                question: questionText,
                answer_type: answerType
            },
        });

        await this.prismaClient.$disconnect();
        return newQuestion;
    }

    async createOptionToQuestion(questionId: string, optionContent: string): Promise<Option> {
        await this.prismaClient.$connect();

        const newOption = await this.prismaClient.option.create({
            data: {
                content: optionContent,
                questionId: questionId,
            },
        });

        await this.prismaClient.$disconnect();
        return newOption;
    }

    async createAnswerToQuestion(questionId: string, optionId: string): Promise<Answer> {
        await this.prismaClient.$connect();

        const newAnswer = await this.prismaClient.answer.create({
            data: {
                questionId: questionId,
                optionId: optionId,
            },
        });

        await this.prismaClient.$disconnect();
        return newAnswer;
    }

    async findQuestionById(questionId: string): Promise<Question | null> {
        await this.prismaClient.$connect();

        const question = await this.prismaClient.question.findUnique({
            where: { id: questionId },
            include: {
                options: true, // Include related options
                answer: true,  // Include related answers
            },
        });

        await this.prismaClient.$disconnect();
        return question;
    }

    async findAllOptionsForQuestion(questionId: string): Promise<Option[]> {
        await this.prismaClient.$connect();

        const options = await this.prismaClient.option.findMany({
            where: { questionId },
        });

        await this.prismaClient.$disconnect();
        return options;
    }

    async findAllAnswersForQuestion(questionId: string): Promise<Answer[]> {
        await this.prismaClient.$connect();

        const answers: Answer[] = await this.prismaClient.answer.findMany({
            where: { questionId },
            include: {
                question: true,
                option: true, // Include related options
            },
        });

        await this.prismaClient.$disconnect();
        return answers;
    }
}
