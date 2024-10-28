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
exports.QuestModuleService = void 0;
const tsyringe_1 = require("tsyringe");
const questModuleRepository_1 = require("../repository/questModuleRepository");
let QuestModuleService = class QuestModuleService {
    constructor(questModuleRepository) {
        this.questModuleRepository = questModuleRepository;
        this.create = (user_id, title, description, background_color) => __awaiter(this, void 0, void 0, function* () {
            const module = yield this.questModuleRepository.createModule({ title, description, background_color, created_by: user_id, updated_by: user_id });
            return {
                statusCode: 201,
                data: module,
                message: "Module Created"
            };
        });
        this.update = (moduleId, updateData) => __awaiter(this, void 0, void 0, function* () {
            const module = yield this.questModuleRepository.updateModule(moduleId, updateData);
            return {
                statusCode: 200,
                data: module,
                message: "Module Updated"
            };
        });
        this.addQuests = (moduleQuestsArray) => __awaiter(this, void 0, void 0, function* () {
            const moduleQuests = yield this.questModuleRepository.addQuestsToModule(moduleQuestsArray);
            return {
                statusCode: 200,
                data: module,
                message: "Quests Added"
            };
        });
        this.removeQuests = (questIds, moduleIds) => __awaiter(this, void 0, void 0, function* () {
            const removeQuests = yield this.questModuleRepository.removeQuestsFromModule(questIds, moduleIds);
            if (removeQuests) {
                return {
                    statusCode: 204,
                    data: removeQuests,
                    message: "Quests Deleted"
                };
            }
            else {
                return {
                    statusCode: 500,
                    data: "",
                    message: "Something Went Wrong"
                };
            }
        });
    }
};
exports.QuestModuleService = QuestModuleService;
exports.QuestModuleService = QuestModuleService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("QuestModuleRepository")),
    __metadata("design:paramtypes", [questModuleRepository_1.QuestModuleRepository])
], QuestModuleService);
