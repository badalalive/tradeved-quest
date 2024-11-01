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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestQNAQuestionDTO = exports.QuestQNAOptionDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
// DTO for options within a question
class QuestQNAOptionDTO {
    constructor(content, isCorrectAnswer) {
        this.content = content;
        this.isCorrectAnswer = isCorrectAnswer;
    }
}
exports.QuestQNAOptionDTO = QuestQNAOptionDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestQNAOptionDTO.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QuestQNAOptionDTO.prototype, "isCorrectAnswer", void 0);
// DTO for a single question with options
class QuestQNAQuestionDTO {
    constructor(questionText, answerType, options, description) {
        this.questionText = questionText;
        this.answerType = answerType;
        this.options = options;
        this.description = description;
    }
}
exports.QuestQNAQuestionDTO = QuestQNAQuestionDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestQNAQuestionDTO.prototype, "questionText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestQNAQuestionDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.AnswerType),
    __metadata("design:type", String)
], QuestQNAQuestionDTO.prototype, "answerType", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)((type) => type === null || type === void 0 ? void 0 : type.object.QuestQNAOptionDTO),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], QuestQNAQuestionDTO.prototype, "options", void 0);
