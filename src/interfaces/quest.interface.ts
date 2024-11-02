interface QuestQnADetails {
    id: string;
    totalQuestions: number;
    quest: {
        id: string;
        title: string;
        description: string;
        content: string;
        contentType: string;
        participantLimit: number;
        maxRewardPoint: number;
        endDate: string;
        status: string;
        viewStatus: string;
        category: string;
        questTime: number;
        approvalStatus: string;
        template: string;
    };
    questions: Array<{
        id: string;
        status: string;
        questionText: string;
        description: string;
        answerType: string;
        options: Array<{
            id: string;
            content: string;
            description: string
        }>;
    }>;
}

interface QuestVoteDetails {
    id: string;
    questId: string;
    newsItem: string;
    voteOptions: Array<{
        id: string;
        optionText: string;
        voteCount: number;
    }>;
    participantVotes: Array<{
        id: string;
        participantId: string;
        optionId: string;
        voted: boolean;
    }>;
    discussions: Array<{
        id: string;
        userId: string;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

interface QuestQnaReviewDetails {
    questions: Array<{
        id: string;
        questionText: string;
        description: string;
        answerType: string;
        options: Array<{
            id: string;
            content: string;
            description: string
        }>;
        selected_options: Array<{
            id: string;
            content: string;
            description: string
        }>
        answer: Array<{
                id: string;
                content: string;
                description: string
        }>
    }>;
}
export async function transformToQuestQnADetails(data: any): Promise<QuestQnADetails> {
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
        questions: await Promise.all(data.questQNAQuestion.map((questionData: any) => ({
            id: questionData.question.id,
            questionText: questionData.question.question,
            description: questionData.question.description,
            answerType: questionData.question.answer_type,
            options: questionData.question.options.map((option: any) => ({
                id: option.id,
                content: option.content,
                description: option.description,
            })),
        }))),
    };
}

export async function transformToQuestVoteDetails(data: any): Promise<QuestVoteDetails> {
    return {
        id: data.id,
        questId: data.quest_id,
        newsItem: data.news_item,
        voteOptions: await Promise.all(data.questVoteOptions.map((option: any) => ({
            id: option.id,
            optionText: option.option_text,
            voteCount: option.vote_count,
        }))),
        participantVotes: await Promise.all(data.questParticipantVote.map((vote: any) => ({
            id: vote.id,
            participantId: vote.participant_id,
            optionId: vote.option_id,
            voted: vote.voted,
        }))),
        discussions: data.questVoteDiscussion.map((discussion: any) => ({
            id: discussion.id,
            userId: discussion.user_id,
            comment: discussion.comment,
            createdAt: new Date(discussion.created_at),
            updatedAt: new Date(discussion.updated_at),
        })),
    };
}

export async function transformToQuestQnaReviewDetails(data: any, selected_options: string[]): Promise<QuestQnaReviewDetails> {
    return {
        questions: await Promise.all(data.questQNAQuestion.map((questionData: any) => {
            const selectedOptionsForQuestion = questionData.question.options
                .filter((option: any) => selected_options.includes(option.id))
                .map((option: any) => ({
                    id: option.id,
                    content: option.content,
                    description: option.description || "",
                }));

            console.log("selectedOptionsForQuestion", selectedOptionsForQuestion);
            console.log("questionData.question.answer", questionData.question);
            return {
                id: questionData.question.id,
                questionText: questionData.question.question,
                description: questionData.question.description || "",
                answerType: questionData.question.answer_type,
                options: questionData.question.options.map((option: any) => ({
                    id: option.id,
                    content: option.content,
                    description: option.description || "",
                })),
                selected_options: selectedOptionsForQuestion,
                answer: questionData.question.answer.map((ans: any) => ({
                    id: ans.id,
                    content: ans.option.content,
                    description: ans.option.description || "",
                }))
            };
        }))
    };
}
