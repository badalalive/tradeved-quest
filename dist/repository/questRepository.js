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
exports.QuestRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
let QuestRepository = class QuestRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    // Find a quest by its ID
    findQuestById(questId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const quest = yield this.prismaClient.quest.findUnique({
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
            yield this.prismaClient.$disconnect();
            return quest;
        });
    }
    findQuestByIdAndViewStatus(questId, view_status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const quest = yield this.prismaClient.quest.findUnique({
                where: { id: questId, view_status },
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
            yield this.prismaClient.$disconnect();
            return quest;
        });
    }
    // Create a new quest
    createQuest(spaceId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newQuest = yield this.prismaClient.quest.create({
                data: {
                    title: data.title,
                    description: data.description,
                    space_id: spaceId,
                    participant_limit: data.participant_limit,
                    max_reward_point: data.max_reward_point,
                    end_date: data.end_date || null,
                    reattempt: data.reattempt,
                    status: client_1.QuestStatus.DRAFTED,
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
            yield this.prismaClient.$disconnect();
            return newQuest;
        });
    }
    // Update an existing quest by its ID
    updateQuestById(questId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const updatedQuest = yield this.prismaClient.quest.update({
                where: { id: questId },
                data: Object.assign(Object.assign({}, updateData), { updated_at: new Date() // Update the updated_at timestamp
                 })
            });
            yield this.prismaClient.$disconnect();
            return updatedQuest;
        });
    }
    updateApprovalStatus(questId, approval_status, reject_reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const quest = yield this.prismaClient.quest.update({
                where: {
                    id: questId
                },
                data: {
                    approval_status: approval_status,
                    reject_reason: reject_reason
                }
            });
            yield this.prismaClient.$disconnect();
            return quest;
        });
    }
    updateQuestStatusById(questId, status, schedule_time) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const quest = yield this.prismaClient.quest.update({
                where: {
                    id: questId
                }, data: {
                    status: status,
                    schedule_time: schedule_time
                }
            });
            yield this.prismaClient.$disconnect();
            return quest;
        });
    }
    toggleViewStatusById(questId, viewStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const updatedQuest = yield this.prismaClient.quest.update({
                where: { id: questId },
                data: {
                    view_status: viewStatus,
                    updated_at: new Date() // Update the updated_at timestamp
                }
            });
            yield this.prismaClient.$disconnect();
            return updatedQuest;
        });
    }
    // Find all quests for a specific space
    findQuestsBySpace(spaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const quests = yield this.prismaClient.quest.findMany({
                where: { space_id: spaceId },
                include: {
                    moduleQuests: true,
                    questParticipant: true
                }
            });
            yield this.prismaClient.$disconnect();
            return quests;
        });
    }
    findQuestsBySpaceAndQuestViewStatus(spaceId, view_status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const quests = yield this.prismaClient.quest.findMany({
                where: { space_id: spaceId, view_status: view_status },
                include: {
                    moduleQuests: true,
                    questParticipant: true
                }
            });
            yield this.prismaClient.$disconnect();
            return quests;
        });
    }
    // Find All quests
    findAll(page, pageSize, sortBy, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            // Fetch total count of records for pagination calculation
            const totalCount = yield this.prismaClient.quest.count();
            // Fetch paginated data with dynamic sorting
            const quests = yield this.prismaClient.quest.findMany({
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            });
            yield this.prismaClient.$disconnect();
            return { quests, totalCount };
        });
    }
    // Delete a quest by its ID
    deleteQuestById(questId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const deleteQuest = yield this.prismaClient.quest.delete({
                where: { id: questId },
            });
            yield this.prismaClient.$disconnect();
            return !!deleteQuest;
        });
    }
};
exports.QuestRepository = QuestRepository;
exports.QuestRepository = QuestRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuestRepository);
