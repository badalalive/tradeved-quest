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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestController = void 0;
const tsyringe_1 = require("tsyringe");
const createQuestDTO_1 = require("../dto/createQuestDTO");
const client_1 = require("@prisma/client");
const questService_1 = require("../service/questService");
const httpException_1 = require("../exceptions/httpException");
const moment_1 = __importDefault(require("moment"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const utilities_1 = require("../utils/utilities");
let QuestController = class QuestController {
    constructor(questService) {
        this.questService = questService;
        // Create a new quest
        this.createQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.space) {
                    next(new httpException_1.HttpException(400, "invalid space"));
                }
                const spaceId = req.space.id;
                const questDTO = (0, class_transformer_1.plainToInstance)(createQuestDTO_1.CreateQuestDTO, req.body);
                const validationErrors = yield (0, class_validator_1.validate)(questDTO);
                if (validationErrors.length > 0) {
                    // Extract error messages for all fields
                    const errorMessages = (0, utilities_1.extractErrorMessages)(validationErrors);
                    return next(new httpException_1.HttpException(400, errorMessages));
                }
                if (questDTO.category === client_1.QuestCategory.TIMED && !questDTO.quest_time) {
                    next(new httpException_1.HttpException(400, "Quest time is required for timed quests"));
                }
                const { data, message, statusCode } = yield this.questService.createQuest(spaceId, questDTO);
                // Send the response
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        // Get quest by ID
        this.findQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                const { data, message, statusCode } = yield this.questService.findQuest(questId);
                // Send the response
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.voteQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                const optionId = req.params.optionId;
                const user = req.user;
                if (!optionId || !questId || !user) {
                    next(new httpException_1.HttpException(400, "invalid params"));
                }
                const { data, message, statusCode } = yield this.questService.updateQuestVoteCount(user, questId, optionId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.getVoteQuestById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                if (!questId) {
                    next(new httpException_1.HttpException(400, "invalid params"));
                }
                const { data, message, statusCode } = yield this.questService.getQuestVoteById(questId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.getQnaQuestById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                if (!questId) {
                    next(new httpException_1.HttpException(400, "invalid params"));
                }
                const { data, message, statusCode } = yield this.questService.getQnaQuestById(questId);
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
                updateQuestDTO.updated_by = req.user.id;
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
                if (!req.space) {
                    next(new httpException_1.HttpException(400, "invalid space"));
                }
                const spaceId = req.space.id;
                const { data, message, statusCode } = yield this.questService.findQuestsBySpace(spaceId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.findAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page, 10) || 1;
                const pageSize = parseInt(req.query.pageSize, 10) || 10;
                const sortBy = req.query.sortBy || 'created_at';
                const sortOrder = req.query.sortOrder || 'desc';
                const { data, message, statusCode, meta } = yield this.questService.findAllQuests(page, pageSize, sortBy, sortOrder);
                res.status(statusCode).send({ data, message, meta });
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
                    return next(new httpException_1.HttpException(400, "Invalid quest ID"));
                }
                const status = req.body.status;
                let schedule_time = req.body.schedule_time ? (0, moment_1.default)(req.body.schedule_time) : null;
                // Validate status as a valid enum value
                if (!Object.values(client_1.QuestStatus).includes(status)) {
                    return next(new httpException_1.HttpException(400, "Invalid status value"));
                }
                // Validate schedule_time when status is SCHEDULED
                if (status === client_1.QuestStatus.SCHEDULED) {
                    if (!schedule_time || !schedule_time.isValid() || !schedule_time.isAfter((0, moment_1.default)())) {
                        return next(new httpException_1.HttpException(400, "Invalid or missing schedule time. It must be a future date."));
                    }
                    schedule_time = schedule_time.toDate();
                }
                else {
                    schedule_time = null;
                }
                const { data, message, statusCode } = yield this.questService.updateQuestStatus(questId, status, schedule_time);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.publishQuest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = req.params.id;
                if (!questId) {
                    return next(new httpException_1.HttpException(400, "Invalid quest ID"));
                }
                const status = req.body.status;
                let schedule_time = req.body.schedule_time ? (0, moment_1.default)(req.body.schedule_time) : null;
                // Validate status as a valid enum value
                if (!(status === client_1.QuestStatus.PUBLISH || status === client_1.QuestStatus.SCHEDULED)) {
                    return next(new httpException_1.HttpException(400, "Invalid status value"));
                }
                // Validate schedule_time when status is SCHEDULED
                if (status === client_1.QuestStatus.SCHEDULED) {
                    if (!schedule_time || !schedule_time.isValid() || !schedule_time.isAfter((0, moment_1.default)())) {
                        return next(new httpException_1.HttpException(400, "Invalid or missing schedule time. It must be a future date."));
                    }
                    schedule_time = schedule_time.toDate();
                }
                else {
                    schedule_time = null;
                }
                const { data, message, statusCode } = yield this.questService.publishQuest(questId, status, schedule_time);
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
        this.uploadMedia = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.questService.uploadMedia(req, res);
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
