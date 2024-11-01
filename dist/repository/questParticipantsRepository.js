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
exports.QuestParticipantsRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
let QuestParticipantsRepository = class QuestParticipantsRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    // add quest participants
    createParticipantToQuest(questId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newParticipant = yield this.prismaClient.questParticipant.create({
                data: {
                    quest_id: questId,
                    participant_id: participantId,
                    completion_status: "NOT_STARTED",
                    joined_at: new Date()
                },
            });
            yield this.prismaClient.$disconnect();
            return newParticipant;
        });
    }
    // update quest participants
    updateParticipantStatus(questId, participantId, status, reward_collected, reattempt_count, completed_at, reward_points, score) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const updatedParticipant = yield this.prismaClient.questParticipant.updateMany({
                where: {
                    quest_id: questId,
                    participant_id: participantId,
                },
                data: {
                    score: score,
                    completion_status: status,
                    reattempt_count: reattempt_count,
                    reward_collected: reward_collected,
                    reward_points: reward_points,
                    completed_at: completed_at
                },
            });
            yield this.prismaClient.$disconnect();
            return !!updatedParticipant;
        });
    }
};
exports.QuestParticipantsRepository = QuestParticipantsRepository;
exports.QuestParticipantsRepository = QuestParticipantsRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuestParticipantsRepository);
