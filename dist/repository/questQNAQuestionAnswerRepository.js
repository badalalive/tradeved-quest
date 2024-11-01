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
exports.QuestQNAQuestionAnswerRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
let QuestQNAQuestionAnswerRepository = class QuestQNAQuestionAnswerRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
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
    addOptionToQuestion(questionId, optionContent) {
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
    addAnswerToQuestion(questionId, optionId) {
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
    getQuestionById(questionId) {
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
    getAllOptionsForQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const options = yield this.prismaClient.option.findMany({
                where: { questionId },
            });
            yield this.prismaClient.$disconnect();
            return options;
        });
    }
    getAllAnswersForQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const answers = yield this.prismaClient.answer.findMany({
                where: { questionId },
                include: {
                    option: true, // Include related options
                },
            });
            yield this.prismaClient.$disconnect();
            return answers;
        });
    }
};
exports.QuestQNAQuestionAnswerRepository = QuestQNAQuestionAnswerRepository;
exports.QuestQNAQuestionAnswerRepository = QuestQNAQuestionAnswerRepository = __decorate([
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuestQNAQuestionAnswerRepository);
