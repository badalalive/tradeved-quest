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
exports.QuestModuleController = void 0;
const tsyringe_1 = require("tsyringe");
const questModuleService_1 = require("../service/questModuleService");
const httpException_1 = require("../exceptions/httpException");
let QuestModuleController = class QuestModuleController {
    constructor(questModuleService) {
        this.questModuleService = questModuleService;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, background_color } = req.body;
                if (!title || !description || !background_color) {
                    new httpException_1.HttpException(400, "invalid request body");
                }
                const { data, message, statusCode } = yield this.questModuleService.create(req.user.id, title, description, background_color);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questModuleId = req.params.id;
                const { title, description, background_color } = req.body;
                const updated_by = req.user.id;
                const updateData = Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (background_color && { background_color })), (updated_by && { updated_by }));
                const { data, message, statusCode } = yield this.questModuleService.update(questModuleId, updateData);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.createQuests = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { questIds, moduleIds, orders } = req.body;
                if (!questIds || !moduleIds || !orders) {
                    new httpException_1.HttpException(400, "invalid request body");
                }
                if (questIds.length !== moduleIds.length || questIds.length !== orders.length) {
                    new httpException_1.HttpException(400, "The lengths of questIds, moduleIds, and orders must be the same");
                }
                // Create data for each quest-module pair with its specific order
                const moduleQuests = questIds.map((questId, index) => ({
                    quest_id: questId,
                    module_id: moduleIds[index],
                    order: orders[index],
                }));
                const { data, statusCode, message } = yield this.questModuleService.createQuests(moduleQuests);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteQuests = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { questIds, moduleIds } = req.body;
                if (!questIds || !moduleIds) {
                    new httpException_1.HttpException(400, "invalid request body");
                }
                if (questIds.length !== moduleIds.length) {
                    new httpException_1.HttpException(400, "The lengths of questIds, moduleIds must be the same");
                }
                const { data, statusCode, message } = yield this.questModuleService.deleteQuests(questIds, moduleIds);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.QuestModuleController = QuestModuleController;
exports.QuestModuleController = QuestModuleController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("QuestModuleService")),
    __metadata("design:paramtypes", [questModuleService_1.QuestModuleService])
], QuestModuleController);
