"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestQnaRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
let QuestQnaRepository = class QuestQnaRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    createQuestQNAWithQuestionsAndOptions(questId, questionsData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const questQNA = yield this.prismaClient.questQNA.create({
                data: {
                    questId: questId,
                    total_question: questionsData.length,
                    questQNAQuestion: {
                        create: yield Promise.all(questionsData.map((questionData) => __awaiter(this, void 0, void 0, function* () {
                            const question = yield this.prismaClient.question.create({
                                data: {
                                    question: questionData.questionText,
                                    description: questionData.description,
                                    answer_type: questionData.answerType,
                                    // Optionally, other fields can be included
                                },
                            });
                            const optionsData = questionData.options.map((option) => __awaiter(this, void 0, void 0, function* () {
                                const createdOption = yield this.prismaClient.option.create({
                                    data: {
                                        content: option.content,
                                        questionId: question.id, // link the option to the question
                                    },
                                });
                                // Create answer if this option is correct
                                if (option.isCorrectAnswer) {
                                    yield this.prismaClient.answer.create({
                                        data: {
                                            questionId: question.id,
                                            optionId: createdOption.id,
                                        },
                                    });
                                }
                                return createdOption;
                            }));
                            yield Promise.all(optionsData); // wait for all options to be created
                            return {
                                question: {
                                    connect: { id: question.id }, // Connect the newly created question
                                },
                                question_status: client_1.QuestionStatus.UNATTEMPTED,
                            };
                        }))),
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
            yield this.prismaClient.$disconnect();
            return questQNA;
        });
    }
    createQuestQNA(questId, totalQuestions) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newQuestQNA = yield this.prismaClient.questQNA.create({
                data: {
                    questId,
                    total_question: totalQuestions,
                },
            });
            yield this.prismaClient.$disconnect();
            return newQuestQNA;
        });
    }
    createQuestionToQNA(questQNAId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newQuestQNAQuestion = yield this.prismaClient.questQNAQuestion.create({
                data: {
                    questQna_id: questQNAId,
                    questionId,
                },
            });
            yield this.prismaClient.$disconnect();
            return newQuestQNAQuestion;
        });
    }
    findQuestQNAByQuestId(questId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const questQNA = yield this.prismaClient.questQNA.findUnique({
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
            yield this.prismaClient.$disconnect();
            return questQNA;
        });
    }
    updateTotalQuestions(questQNAId, totalQuestions) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const updatedQuestQNA = yield this.prismaClient.questQNA.update({
                where: { id: questQNAId },
                data: { total_question: totalQuestions },
            });
            yield this.prismaClient.$disconnect();
            return updatedQuestQNA;
        });
    }
    findAllQuestionsForQNA(questQNAId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const questions = yield this.prismaClient.questQNAQuestion.findMany({
                where: { questQna_id: questQNAId },
                include: {
                    question: true, // Include related question data
                },
            });
            yield this.prismaClient.$disconnect();
            return questions;
        });
    }
    createQuestion(questionText, answerType) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newQuestion = yield this.prismaClient.question.create({
                data: {
                    question: questionText,
                    answer_type: answerType
                },
            });
            yield this.prismaClient.$disconnect();
            return newQuestion;
        });
    }
    createOptionToQuestion(questionId, optionContent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newOption = yield this.prismaClient.option.create({
                data: {
                    content: optionContent,
                    questionId: questionId,
                },
            });
            yield this.prismaClient.$disconnect();
            return newOption;
        });
    }
    createAnswerToQuestion(questionId, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newAnswer = yield this.prismaClient.answer.create({
                data: {
                    questionId: questionId,
                    optionId: optionId,
                },
            });
            yield this.prismaClient.$disconnect();
            return newAnswer;
        });
    }
    findQuestionById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const question = yield this.prismaClient.question.findUnique({
                where: { id: questionId },
                include: {
                    options: true, // Include related options
                    answer: true, // Include related answers
                },
            });
            yield this.prismaClient.$disconnect();
            return question;
        });
    }
    findAllOptionsForQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const options = yield this.prismaClient.option.findMany({
                where: { questionId },
            });
            yield this.prismaClient.$disconnect();
            return options;
        });
    }
    findAllAnswersForQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const answers = yield this.prismaClient.answer.findMany({
                where: { questionId },
                include: {
                    question: true,
                    option: true, // Include related options
                },
            });
            yield this.prismaClient.$disconnect();
            return answers;
        });
    }
};
exports.QuestQnaRepository = QuestQnaRepository;
exports.QuestQnaRepository = QuestQnaRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuestQnaRepository);
