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
exports.QuestVoteRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
let QuestVoteRepository = class QuestVoteRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    updateParticipantVoteByUserIdAndQuestVoteId(questVoteId, userId, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const result = yield this.prismaClient.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                // Step 1: Retrieve the current vote status of the participant
                const existingVote = yield prisma.questParticipantVote.findUnique({
                    where: {
                        // Assuming a unique constraint on the combination of quest_vote_id and participant_id
                        quest_vote_id_participant_id: {
                            quest_vote_id: questVoteId,
                            participant_id: userId,
                        },
                    },
                });
                // Step 2: Upsert the QuestParticipantVote record
                const upsertedParticipantVote = yield prisma.questParticipantVote.upsert({
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
                    const updatedVoteOption = yield prisma.questVoteOption.update({
                        where: { id: optionId },
                        data: {
                            vote_count: {
                                increment: 1,
                            },
                        },
                    });
                }
                return true;
            }));
            yield this.prismaClient.$disconnect();
            return result;
        });
    }
    findQuestVoteById(questVoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const questVote = yield this.prismaClient.questVote.findUnique({
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
            });
            yield this.prismaClient.$disconnect();
            return questVote;
        });
    }
};
exports.QuestVoteRepository = QuestVoteRepository;
exports.QuestVoteRepository = QuestVoteRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuestVoteRepository);
