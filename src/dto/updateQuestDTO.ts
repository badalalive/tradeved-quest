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
import { QuestStatus, QuestCategory } from '@prisma/client'; // Assuming you have enums for QuestStatus and QuestCategory

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
    @IsEnum(QuestStatus)
    status?: QuestStatus;

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
}
