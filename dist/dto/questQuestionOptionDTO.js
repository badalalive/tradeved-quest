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
exports.QuestQuestionsWithSelectedOptionsDTO = exports.QuestionOptionDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class QuestionOptionDTO {
    constructor(question_id, selected_options) {
        this.question_id = question_id;
        this.selected_options = selected_options;
    }
}
exports.QuestionOptionDTO = QuestionOptionDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QuestionOptionDTO.prototype, "question_id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(0),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], QuestionOptionDTO.prototype, "selected_options", void 0);
class QuestQuestionsWithSelectedOptionsDTO {
    constructor(question) {
        this.question = question;
    }
}
exports.QuestQuestionsWithSelectedOptionsDTO = QuestQuestionsWithSelectedOptionsDTO;
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)((type) => type === null || type === void 0 ? void 0 : type.object.QuestionOptionDTO),
    __metadata("design:type", QuestionOptionDTO)
], QuestQuestionsWithSelectedOptionsDTO.prototype, "question", void 0);
