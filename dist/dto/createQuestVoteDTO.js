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
exports.QuestVoteDTO = exports.QuestVoteOptionDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class QuestVoteOptionDTO {
    constructor(option_text) {
        this.option_text = option_text;
    }
}
exports.QuestVoteOptionDTO = QuestVoteOptionDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestVoteOptionDTO.prototype, "option_text", void 0);
class QuestVoteDTO {
    constructor(news_item, options) {
        this.news_item = news_item;
        this.options = options;
    }
}
exports.QuestVoteDTO = QuestVoteDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestVoteDTO.prototype, "news_item", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)((type) => type === null || type === void 0 ? void 0 : type.object.QuestVoteOptionDTO),
    (0, class_validator_1.ArrayMinSize)(2),
    __metadata("design:type", Array)
], QuestVoteDTO.prototype, "options", void 0);
