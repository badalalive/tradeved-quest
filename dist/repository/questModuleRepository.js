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
exports.QuestModuleRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
let QuestModuleRepository = class QuestModuleRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    // create quest module
    createModule(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newModule = yield this.prismaClient.module.create({
                data: {
                    title: data.title,
                    description: data.description,
                    background_color: data.background_color,
                    image_url: data.image_url,
                    created_by: data.created_by,
                    updated_by: data.updated_by,
                },
            });
            yield this.prismaClient.$disconnect();
            return newModule;
        });
    }
    // update quest module
    updateModule(moduleId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const updatedModule = yield this.prismaClient.module.update({
                where: { id: moduleId },
                data: Object.assign(Object.assign({}, updateData), { updated_at: new Date() }),
            });
            yield this.prismaClient.$disconnect();
            return updatedModule;
        });
    }
    // find all quest module
    findModulesWithQuests() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const modules = yield this.prismaClient.module.findMany({
                include: {
                    moduleQuests: {
                        include: {
                            quest: true,
                        },
                    },
                },
            });
            yield this.prismaClient.$disconnect();
            return modules;
        });
    }
    // Add a quest to a module
    addQuestToModule(questId, moduleId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const moduleQuest = yield this.prismaClient.moduleQuest.create({
                data: {
                    quest_id: questId,
                    module_id: moduleId,
                    order: order,
                }
            });
            yield this.prismaClient.$disconnect();
            return moduleQuest;
        });
    }
    // Remove a quest from a module
    removeQuestFromModule(questId, moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const deleteModuleQuest = yield this.prismaClient.moduleQuest.deleteMany({
                where: {
                    quest_id: questId,
                    module_id: moduleId
                }
            });
            yield this.prismaClient.$disconnect();
            return deleteModuleQuest.count > 0;
        });
    }
    // Find all quests that belong to a module
    findQuestsByModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const quests = yield this.prismaClient.quest.findMany({
                where: {
                    moduleQuests: {
                        some: {
                            module_id: moduleId
                        }
                    }
                },
                include: {
                    moduleQuests: true
                }
            });
            yield this.prismaClient.$disconnect();
            return quests;
        });
    }
    // find module by quest
    findModulesByQuest(questId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const modules = yield this.prismaClient.module.findMany({
                where: {
                    moduleQuests: {
                        some: { quest_id: questId },
                    },
                },
                include: {
                    moduleQuests: true,
                },
            });
            yield this.prismaClient.$disconnect();
            return modules;
        });
    }
};
exports.QuestModuleRepository = QuestModuleRepository;
exports.QuestModuleRepository = QuestModuleRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuestModuleRepository);
