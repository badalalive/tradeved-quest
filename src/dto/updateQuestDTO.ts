import {
    IsString,
    IsOptional,
    IsInt,
    Min,
    MaxLength,
    IsEnum,
    IsDate,
    IsUUID
} from 'class-validator';
import {QuestStatus, QuestCategory, QuestApprovalStatus} from '@prisma/client';
import {Type} from "class-transformer"; // Assuming you have enums for QuestStatus and QuestCategory

export class UpdateQuestDTO {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    participant_limit?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    max_reward_point?: number;

    @IsOptional()
    @IsDate()
    end_date?: Date;

    @IsOptional()
    @IsInt()
    @Min(0)
    reattempt?: number;

    @IsOptional()
    @IsEnum(QuestCategory)
    category?: QuestCategory;

    @IsOptional()
    @IsInt()
    @Min(1)
    quest_time?: number; // Optional, quest time in seconds

    @IsOptional()
    @IsString()
    updated_by?: string;

    constructor(
        title: string,
        description: string,
        participant_limit: number,
        max_reward_point: number,
        end_date: Date,
        reattempt: number,
        status: QuestStatus,
        category: QuestCategory,
        template_id: string,
        quest_time?: number,
        updated_by?: string,
    ) {
        this.title = title;
        this.description = description;
        this.participant_limit = participant_limit;
        this.max_reward_point = max_reward_point;
        this.end_date = end_date;
        this.reattempt = reattempt;
        this.category = category;
        this.quest_time = quest_time;
        this.updated_by = updated_by;
    }
}
