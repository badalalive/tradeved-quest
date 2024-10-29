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
    MaxLength
} from 'class-validator';
import {QuestStatus, QuestCategory, QuestTemplate, QuestContentType} from '@prisma/client'; // Assuming you have enums for QuestStatus and QuestCategory

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

    @IsDate()
    @IsOptional()
    end_date?: Date;

    @IsInt()
    @Min(-1)
    reattempt: number;


    @IsEnum(QuestCategory)
    @IsNotEmpty()
    category: QuestCategory;

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

    constructor(
        title: string,
        description: string,
        content: string,
        content_type: QuestContentType,
        space_id: string,
        participant_limit: number,
        max_reward_point: number,
        end_date: Date,
        reattempt: number,
        category: QuestCategory,
        template: QuestTemplate,
        quest_time?: number,
        created_by?: string,
        updated_by?: string
    ) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.content_type = content_type;
        this.participant_limit = participant_limit;
        this.max_reward_point = max_reward_point;
        this.end_date = end_date;
        this.reattempt = reattempt;
        this.category = category;
        this.template = template;
        this.quest_time = quest_time;
        this.created_by = created_by;
        this.updated_by = updated_by;
    }
}
