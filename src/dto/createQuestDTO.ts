import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    Min,
    Max,
    IsEnum,
    IsDate,
    IsUUID,
    MaxLength, ValidateNested, IsUrl
} from 'class-validator';
import {QuestStatus, QuestCategory, QuestTemplate, QuestContentType, QuestViewStatus} from '@prisma/client';
import {Type} from "class-transformer";
import {QuestQNAQuestionDTO} from "./createQuestQNADTO";
import {QuestVoteDTO} from "./createQuestVoteDTO"; // Assuming you have enums for QuestStatus and QuestCategory

export class CreateQuestDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    description: string;

    @IsString()
    @IsNotEmpty()
    logo_url: string;

    @IsString()
    @IsNotEmpty()
    content: string

    @IsEnum(QuestContentType)
    @IsNotEmpty()
    content_type: QuestContentType

    @IsInt()
    @Min(1,{message: "participant can not be zero"})
    participant_limit: number;

    @IsInt()
    @Min(0)
    max_reward_point: number;

    @Type((type) => type?.object.Date)
    @IsOptional()
    end_date?: Date;

    @IsInt()
    @Min(-1)
    reattempt: number;


    @IsEnum(QuestCategory)
    @IsNotEmpty()
    category: QuestCategory;

    @IsEnum(QuestViewStatus)
    @IsNotEmpty()
    view_status: QuestViewStatus;

    @IsOptional()
    @IsInt()
    @Min(1)
    quest_time?: number; // Optional, quest time in seconds

    @IsEnum(QuestTemplate)
    @IsNotEmpty()
    template: QuestTemplate;

    @IsString()
    @IsOptional()
    created_by?: string;

    @IsString()
    @IsOptional()
    updated_by?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type((type) => type?.object.QuestQNAQuestionDTO)
    questQNA?: QuestQNAQuestionDTO[];

    @IsOptional()
    @ValidateNested({ each: true})
    @Type((type) => type?.object.QuestVoteDTO)
    questVote?: QuestVoteDTO[];

    constructor(
        title: string,
        description: string,
        logo_url: string,
        content: string,
        content_type: QuestContentType,
        space_id: string,
        participant_limit: number,
        max_reward_point: number,
        end_date: Date,
        reattempt: number,
        category: QuestCategory,
        view_status: QuestViewStatus,
        template: QuestTemplate,
        quest_time?: number,
        created_by?: string,
        updated_by?: string,
        questQNA?: QuestQNAQuestionDTO[]
    ) {
        this.title = title;
        this.description = description;
        this.logo_url = logo_url;
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
