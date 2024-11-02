"use strict";
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
exports.transformToQuestQnADetails = transformToQuestQnADetails;
exports.transformToQuestVoteDetails = transformToQuestVoteDetails;
exports.transformToQuestQnaReviewDetails = transformToQuestQnaReviewDetails;
function transformToQuestQnADetails(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            id: data.id,
            totalQuestions: data.total_question,
            quest: {
                id: data.quest.id,
                title: data.quest.title,
                description: data.quest.description,
                content: data.quest.content,
                contentType: data.quest.content_type,
                participantLimit: data.quest.participant_limit,
                maxRewardPoint: data.quest.max_reward_point,
                endDate: data.quest.end_date,
                status: data.quest.status,
                viewStatus: data.quest.view_status,
                category: data.quest.category,
                questTime: data.quest.quest_time,
                approvalStatus: data.quest.approval_status,
                template: data.quest.template,
            },
            questions: yield Promise.all(data.questQNAQuestion.map((questionData) => ({
                id: questionData.question.id,
                questionText: questionData.question.question,
                description: questionData.question.description,
                answerType: questionData.question.answer_type,
                options: questionData.question.options.map((option) => ({
                    id: option.id,
                    content: option.content,
                    description: option.description,
                })),
            }))),
        };
    });
}
function transformToQuestVoteDetails(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            id: data.id,
            questId: data.quest_id,
            newsItem: data.news_item,
            voteOptions: yield Promise.all(data.questVoteOptions.map((option) => ({
                id: option.id,
                optionText: option.option_text,
                voteCount: option.vote_count,
            }))),
            participantVotes: yield Promise.all(data.questParticipantVote.map((vote) => ({
                id: vote.id,
                participantId: vote.participant_id,
                optionId: vote.option_id,
                voted: vote.voted,
            }))),
            discussions: data.questVoteDiscussion.map((discussion) => ({
                id: discussion.id,
                userId: discussion.user_id,
                comment: discussion.comment,
                createdAt: new Date(discussion.created_at),
                updatedAt: new Date(discussion.updated_at),
            })),
        };
    });
}
function transformToQuestQnaReviewDetails(data, selected_options) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            questions: yield Promise.all(data.questQNAQuestion.map((questionData) => {
                const selectedOptionsForQuestion = questionData.question.options
                    .filter((option) => selected_options.includes(option.id))
                    .map((option) => ({
                    id: option.id,
                    content: option.content,
                    description: option.description || "",
                }));
                return {
                    id: questionData.question.id,
                    questionText: questionData.question.question,
                    description: questionData.question.description || "",
                    answerType: questionData.question.answer_type,
                    options: questionData.question.options.map((option) => ({
                        id: option.id,
                        content: option.content,
                        description: option.description || "",
                    })),
                    selected_options: selectedOptionsForQuestion,
                    answer: questionData.question.answer.map((ans) => ({
                        id: ans.id,
                        content: ans.option.content,
                        description: ans.option.description || "",
                    }))
                };
            }))
        };
    });
}
