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
exports.QuestService = void 0;
const tsyringe_1 = require("tsyringe");
const questRepository_1 = require("../repository/questRepository");
const httpException_1 = require("../exceptions/httpException");
const client_1 = require("@prisma/client");
let QuestService = class QuestService {
    constructor(questRepository) {
        this.questRepository = questRepository;
        // Create a new quest
        this.createQuest = (spaceId, questDTO) => __awaiter(this, void 0, void 0, function* () {
            if (questDTO.participant_limit <= 0) {
                throw new httpException_1.HttpException(400, "Participant limit must be greater than zero");
            }
            // Check if a quest with the same title exists in the space
            const existingQuest = yield this.questRepository.findQuestsBySpace(spaceId);
            if (existingQuest === null || existingQuest === void 0 ? void 0 : existingQuest.some(quest => quest.title === questDTO.title)) {
                throw new httpException_1.HttpException(409, "A quest with this title already exists in the space");
            }
            // Create a new quest
            const newQuest = yield this.questRepository.createQuest(Object.assign(Object.assign({}, questDTO), { created_by: spaceId, updated_by: spaceId }));
            return {
                statusCode: 201,
                message: "Quest created successfully",
                data: newQuest,
            };
        });
        // Fetch a quest by its ID
        this.getQuest = (questId) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            return {
                statusCode: 200,
                message: "Quest details fetched successfully",
                data: quest,
            };
        });
        // Update a quest by ID
        this.updateQuest = (questId, updateQuestDTO) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            if (quest.approval_status === client_1.QuestApprovalStatus.APPROVED) {
                throw new httpException_1.HttpException(400, "Approved quests cannot be updated");
            }
            const updatedQuest = yield this.questRepository.updateQuestById(questId, Object.assign({}, updateQuestDTO));
            return {
                statusCode: 200,
                message: "Quest updated successfully",
                data: updatedQuest,
            };
        });
        // Delete a quest by ID
        this.deleteQuest = (questId) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            const deleted = yield this.questRepository.deleteQuestById(questId);
            return {
                statusCode: 200,
                message: "Quest deleted successfully",
                data: deleted,
            };
        });
        // Find all quests for a specific space
        this.findQuestsBySpace = (spaceId) => __awaiter(this, void 0, void 0, function* () {
            const quests = yield this.questRepository.findQuestsBySpace(spaceId);
            if (!quests) {
                throw new httpException_1.HttpException(404, "No quests found for the specified space");
            }
            return {
                statusCode: 200,
                message: "Quests fetched successfully",
                data: quests,
            };
        });
        // Find all quests for a space with templates
        this.findQuestsWithTemplate = (spaceId) => __awaiter(this, void 0, void 0, function* () {
            const quests = yield this.questRepository.findQuestsWithTemplate(spaceId);
            if (!quests) {
                throw new httpException_1.HttpException(404, "No quests with templates found for the specified space");
            }
            return {
                statusCode: 200,
                message: "Quests with templates fetched successfully",
                data: quests,
            };
        });
        // Update quest status
        this.updateQuestStatus = (questId, status) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            if (quest.status === status) {
                throw new httpException_1.HttpException(400, "Quest is already in the specified status");
            }
            const updatedQuest = yield this.questRepository.updateQuestById(questId, { status });
            return {
                statusCode: 200,
                message: `Quest status updated to ${status}`,
                data: updatedQuest,
            };
        });
        // Submit quest for approval
        this.submitQuestForApproval = (questId, type, reject_reason) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            if (quest.approval_status !== client_1.QuestApprovalStatus.REVIEW) {
                throw new httpException_1.HttpException(400, "Only quests in review status can be submitted for approval");
            }
            const status = client_1.QuestApprovalStatus[type];
            const updatedQuest = yield this.questRepository.updateQuestById(questId, {
                approval_status: client_1.QuestApprovalStatus.APPROVED,
                reject_reason: reject_reason
            });
            return {
                statusCode: 200,
                message: "Quest submitted for approval",
                data: updatedQuest,
            };
        });
    }
};
exports.QuestService = QuestService;
exports.QuestService = QuestService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("QuestRepository")),
    __metadata("design:paramtypes", [questRepository_1.QuestRepository])
], QuestService);
