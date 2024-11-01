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
exports.CreateQuestDTO = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class CreateQuestDTO {
    constructor(title, description, content, content_type, space_id, participant_limit, max_reward_point, end_date, reattempt, category, view_status, template, quest_time, created_by, updated_by, questQNA) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.content_type = content_type;
        this.participant_limit = participant_limit;
        this.max_reward_point = max_reward_point;
        this.end_date = end_date;
        this.reattempt = reattempt;
        this.category = category;
        this.view_status = view_status;
        this.template = template;
        this.quest_time = quest_time;
        this.created_by = created_by;
        this.updated_by = updated_by;
        this.questQNA = questQNA;
    }
}
exports.CreateQuestDTO = CreateQuestDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.QuestContentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "content_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: "participant can not be zero" }),
    __metadata("design:type", Number)
], CreateQuestDTO.prototype, "participant_limit", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuestDTO.prototype, "max_reward_point", void 0);
__decorate([
    (0, class_transformer_1.Type)((type) => type === null || type === void 0 ? void 0 : type.object.Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateQuestDTO.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(-1),
    __metadata("design:type", Number)
], CreateQuestDTO.prototype, "reattempt", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.QuestCategory),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.QuestViewStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "view_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateQuestDTO.prototype, "quest_time", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.QuestTemplate),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "template", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateQuestDTO.prototype, "updated_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)((type) => type === null || type === void 0 ? void 0 : type.object.QuestQNAQuestionDTO),
    __metadata("design:type", Array)
], CreateQuestDTO.prototype, "questQNA", void 0);
