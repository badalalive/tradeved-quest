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
exports.QuestController = void 0;
const tsyringe_1 = require("tsyringe");
const questService_1 = require("../service/questService");
const httpException_1 = require("../exceptions/httpException");
let QuestController = class QuestController {
    constructor(questService) {
        this.questService = questService;
        // Create a new quest
        this.createQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spaceId = req.params.spaceId;
                const questDTO = req.body;
                const { data, message, statusCode } = yield this.questService.createQuest(spaceId, questDTO);
                // Send the response
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Get quest by ID
        this.getQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                const { data, message, statusCode } = yield this.questService.getQuest(questId);
                // Send the response
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Update a quest by ID
        this.updateQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                if (!questId) {
                    next(new httpException_1.HttpException(400, "invalid quest id"));
                }
                const updateQuestDTO = req.body;
                const { data, message, statusCode } = yield this.questService.updateQuest(questId, updateQuestDTO);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Delete a quest by ID
        this.deleteQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                if (!questId) {
                    next(new httpException_1.HttpException(400, "invalid quest id"));
                }
                const { data, message, statusCode } = yield this.questService.deleteQuest(questId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Find all quests for a specific space
        this.findQuestsBySpace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spaceId = req.params.spaceId;
                if (!spaceId) {
                    next(new httpException_1.HttpException(400, "invalid space id"));
                }
                const { data, message, statusCode } = yield this.questService.findQuestsBySpace(spaceId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Find all quests for a space with templates
        this.findQuestsWithTemplate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spaceId = req.params.spaceId;
                const { data, message, statusCode } = yield this.questService.findQuestsWithTemplate(spaceId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Update quest status
        this.updateQuestStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                if (!questId) {
                    next(new httpException_1.HttpException(400, "invalid quest id"));
                }
                const status = req.body.status;
                const { data, message, statusCode } = yield this.questService.updateQuestStatus(questId, status);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Submit quest for approval
        this.submitQuestForApproval = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                const type = req.params.type;
                let reject_reason = req.body.reject_reason;
                if (!questId) {
                    next(new httpException_1.HttpException(400, "invalid quest id"));
                }
                if (!(type === 'APPROVED' || type === 'REJECTED')) {
                    next(new httpException_1.HttpException(400, "invalid status type"));
                }
                if (type === 'APPROVED') {
                    reject_reason = "";
                }
                const { data, message, statusCode } = yield this.questService.submitQuestForApproval(questId, type, reject_reason);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.toggleView = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                const { data, message, statusCode } = yield this.questService.toggleView(questId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.QuestController = QuestController;
exports.QuestController = QuestController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("QuestService")),
    __metadata("design:paramtypes", [questService_1.QuestService])
], QuestController);
