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
exports.UpdateQuestDTO = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client"); // Assuming you have enums for QuestStatus and QuestCategory
class UpdateQuestDTO {
    constructor(title, description, participant_limit, max_reward_point, end_date, reattempt, status, approval_status, reject_reason, category, template_id, quest_time, updated_by) {
        this.title = title;
        this.description = description;
        this.participant_limit = participant_limit;
        this.max_reward_point = max_reward_point;
        this.end_date = end_date;
        this.reattempt = reattempt;
        this.status = status;
        this.approval_status = approval_status;
        this.reject_reason = reject_reason;
        this.category = category;
        this.quest_time = quest_time;
        this.updated_by = updated_by;
    }
}
exports.UpdateQuestDTO = UpdateQuestDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateQuestDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateQuestDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuestDTO.prototype, "participant_limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuestDTO.prototype, "max_reward_point", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateQuestDTO.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateQuestDTO.prototype, "reattempt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.QuestStatus),
    __metadata("design:type", String)
], UpdateQuestDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.QuestApprovalStatus),
    __metadata("design:type", String)
], UpdateQuestDTO.prototype, "approval_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestDTO.prototype, "reject_reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.QuestCategory),
    __metadata("design:type", String)
], UpdateQuestDTO.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuestDTO.prototype, "quest_time", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestDTO.prototype, "updated_by", void 0);
