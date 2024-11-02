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
const questParticipantsRepository_1 = require("../repository/questParticipantsRepository");
const questVoteRepository_1 = require("../repository/questVoteRepository");
const questQnaRepository_1 = require("../repository/questQnaRepository");
const quest_interface_1 = require("../interfaces/quest.interface");
let QuestService = class QuestService {
    constructor(questRepository, questParticipantsRepository, questVoteRepository, questQnaRepository) {
        this.questRepository = questRepository;
        this.questParticipantsRepository = questParticipantsRepository;
        this.questVoteRepository = questVoteRepository;
        this.questQnaRepository = questQnaRepository;
        // Create a new quest
        this.createQuest = (spaceId, questDTO) => __awaiter(this, void 0, void 0, function* () {
            // Check if a quest with the same title exists in the space
            const existingQuest = yield this.questRepository.findQuestsBySpace(spaceId);
            if (existingQuest === null || existingQuest === void 0 ? void 0 : existingQuest.some(quest => quest.title === questDTO.title)) {
                throw new httpException_1.HttpException(409, "A quest with this title already exists in the space");
            }
            let newQuest;
            if (questDTO.template === client_1.QuestTemplate.QNA) {
                // Create a new qna quest
                newQuest = yield this.questRepository.createQuestWithQNA(spaceId, questDTO);
            }
            else if (questDTO.template === client_1.QuestTemplate.VOTE) {
                // Create a new vote quest
                newQuest = yield this.questRepository.createQuestWithVote(spaceId, questDTO);
            }
            else {
                throw new httpException_1.HttpException(400, "Only QNA, VOTE template supported");
            }
            return {
                statusCode: 201,
                message: "Quest created successfully",
                data: newQuest,
            };
        });
        // Fetch a quest by its ID
        this.findQuest = (questId) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestByIdAndViewStatus(questId, client_1.QuestViewStatus.PUBLIC);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            return {
                statusCode: 200,
                message: "Quest details fetched successfully",
                data: quest,
            };
        });
        this.updateQuestVoteCount = (user, questId, optionId) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            let questParticipant = yield this.questParticipantsRepository.findParticipantByUserId(user.id);
            // quest template should be "VOTE"
            if (quest.template !== client_1.QuestTemplate.VOTE) {
                throw new httpException_1.HttpException(400, "Invalid Quest For This Action");
            }
            // quest attempt's check
            if (questParticipant && questParticipant.reattempt_count <= quest.reattempt) {
                throw new httpException_1.HttpException(400, "Attempt Over");
            }
            questParticipant = yield this.questParticipantsRepository.updateParticipantStats(quest.id, user.id, client_1.QuestCompletionStatus.COMPLETED, true, new Date(), new Date(), quest.max_reward_point, questParticipant ? Number(questParticipant.reattempt_count) + 1 : 1, 0);
            const questVoteParticipant = yield this.questVoteRepository.updateParticipantVoteByUserIdAndQuestVoteId(quest.questVote.id, user.id, optionId);
            if (questVoteParticipant && questParticipant) {
                return {
                    statusCode: 200,
                    message: "Voted Successfully",
                    data: questParticipant,
                };
            }
            else {
                return {
                    statusCode: 400,
                    message: "Something went wrong",
                    data: "",
                };
            }
        });
        this.findQuestVoteById = (questId) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest.questVote) {
                throw new httpException_1.HttpException(404, "quest voting article not found");
            }
            return {
                statusCode: 200,
                message: "Quest Vote Details",
                data: yield (0, quest_interface_1.transformToQuestVoteDetails)(quest.questVote),
            };
        });
        this.findQnaQuestById = (questId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.questQnaRepository.findQuestQNAByQuestId(questId);
            const questQna = yield (0, quest_interface_1.transformToQuestQnADetails)(data);
            return {
                statusCode: 200,
                message: "Quest Qna Details",
                data: questQna
            };
        });
        this.findAnswerByQuestionId = (user, questId, questQuestionOptionsDTO) => __awaiter(this, void 0, void 0, function* () {
            const questQNA = yield this.questQnaRepository.findQuestQNAByQuestId(questId);
            const question = yield this.questQnaRepository.findQuestionById(questQuestionOptionsDTO.question.question_id);
            if (question.answer_type === client_1.AnswerType.SINGLE && questQuestionOptionsDTO.question.selected_options.length > 1) {
                throw new httpException_1.HttpException(400, "invalid options selected");
            }
            if (questQuestionOptionsDTO.question.selected_options.length === 0) {
                const questQNAParticipantAnswer = yield this.questQnaRepository.createQuestQNAParticipantAnswer(questQNA.id, user.id, null, null);
                return {
                    statusCode: 200,
                    message: "answer skipped",
                    data: questQNAParticipantAnswer
                };
            }
            const options = question.answer.map((a) => a.optionId);
            const is_answer_correct = options.every(value => questQuestionOptionsDTO.question.selected_options.includes(value));
            const questQNAParticipantAnswer = yield this.questQnaRepository.createQuestQNAParticipantAnswer(questQNA.id, user.id, questQuestionOptionsDTO.question.selected_options, is_answer_correct ? client_1.QuestionStatus.CORRECT : client_1.QuestionStatus.INCORRECT);
            return {
                statusCode: 200,
                data: questQNAParticipantAnswer,
                message: "answer checked"
            };
        });
        this.submitQuestionAnswer = (questQuestionOptionsDTO) => __awaiter(this, void 0, void 0, function* () {
            return {
                statusCode: 200,
                message: "Quest Qna Submitted",
                data: ""
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
            const quests = yield this.questRepository.findQuestsBySpaceAndQuestViewStatus(spaceId, client_1.QuestViewStatus.PUBLIC);
            if (!quests) {
                throw new httpException_1.HttpException(404, "No quests found for the specified space");
            }
            return {
                statusCode: 200,
                message: "Quests fetched successfully",
                data: quests,
            };
        });
        this.findAllQuests = (...args_1) => __awaiter(this, [...args_1], void 0, function* (page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc') {
            const { quests, totalCount } = yield this.questRepository.findAll(page, pageSize, sortBy, sortOrder);
            const totalPages = Math.ceil(totalCount / pageSize);
            return {
                statusCode: 200,
                message: "Quests fetched successfully",
                data: quests,
                meta: {
                    page,
                    pageSize,
                    totalCount,
                    totalPages,
                },
            };
        });
        // Update quest status
        this.updateQuestStatus = (questId, status, schedule_time) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            if (quest.status === status) {
                throw new httpException_1.HttpException(400, "Quest is already in the specified status");
            }
            const updatedQuest = yield this.questRepository.updateQuestStatusById(questId, status, schedule_time);
            return {
                statusCode: 200,
                message: `Quest status updated to ${status}`,
                data: updatedQuest,
            };
        });
        this.publishQuest = (questId, status, schedule_time) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            if (quest.status === status) {
                throw new httpException_1.HttpException(400, "Quest is already in the specified status");
            }
            yield this.questRepository.updateQuestStatusById(questId, status, schedule_time);
            const updatedQuest = yield this.questRepository.updateApprovalStatus(questId, client_1.QuestApprovalStatus.REVIEW, "");
            return {
                statusCode: 200,
                message: `Quest Published`,
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
            const updatedQuest = yield this.questRepository.updateApprovalStatus(questId, status, reject_reason);
            return {
                statusCode: 200,
                message: "Quest submitted for approval",
                data: updatedQuest,
            };
        });
        this.toggleView = (questId) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield this.questRepository.findQuestById(questId);
            if (!quest) {
                throw new httpException_1.HttpException(404, "Quest not found");
            }
            let updateQuest;
            if (quest.view_status === client_1.QuestViewStatus.PUBLIC) {
                updateQuest = yield this.questRepository.toggleViewStatusById(questId, client_1.QuestViewStatus.PRIVATE);
            }
            else {
                updateQuest = yield this.questRepository.toggleViewStatusById(questId, client_1.QuestViewStatus.PUBLIC);
            }
            return {
                statusCode: 200,
                message: `toggle to ${updateQuest.view_status}`,
                data: updateQuest,
            };
        });
        this.uploadMedia = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // await new Promise<void>((resolve, reject) => {
            //     // Using multer middleware to handle single file upload
            //     uploadFile.single('file')(req, res, (err: any) => {
            //         if (err) {
            //             return reject(new HttpException(500, 'Server error during file upload'));
            //         }
            //         if (!req.file) {
            //             return reject(new HttpException(400, 'No file uploaded'));
            //         }
            //         resolve();
            //     });
            // });
            var _a, _b, _c;
            // Extract file information from req.file
            const fileInfo = {
                filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                path: `${process.env.SERVER_URL}${(_b = req.file) === null || _b === void 0 ? void 0 : _b.destination}${(_c = req.file) === null || _c === void 0 ? void 0 : _c.filename}`,
            };
            return {
                statusCode: 200,
                message: 'File uploaded successfully',
                data: fileInfo,
            };
        });
    }
};
exports.QuestService = QuestService;
exports.QuestService = QuestService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("QuestRepository")),
    __param(1, (0, tsyringe_1.inject)("QuestParticipantsRepository")),
    __param(2, (0, tsyringe_1.inject)("QuestVoteRepository")),
    __param(3, (0, tsyringe_1.inject)("QuestQnaRepository")),
    __metadata("design:paramtypes", [questRepository_1.QuestRepository,
        questParticipantsRepository_1.QuestParticipantsRepository,
        questVoteRepository_1.QuestVoteRepository,
        questQnaRepository_1.QuestQnaRepository])
], QuestService);
