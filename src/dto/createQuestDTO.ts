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
import { QuestStatus, QuestCategory } from '@prisma/client'; // Assuming you have enums for QuestStatus and QuestCategory

export class CreateQuestDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    description: string;

    @IsUUID()
    @IsNotEmpty()
    space_id: string;

    @IsInt()
    @Min(1)
    participant_limit: number;

    @IsInt()
    @Min(1)
    max_reward_point: number;

    @IsDate()
    @IsNotEmpty()
    end_date: Date;

    @IsInt()
    @Min(0)
    reattempt: number;

    @IsEnum(QuestStatus)
    @IsNotEmpty()
    status: QuestStatus;

    @IsEnum(QuestCategory)
    @IsNotEmpty()
    category: QuestCategory;

    @IsOptional()
    @IsInt()
    @Min(1)
    quest_time?: number; // Optional, quest time in seconds

    @IsString()
    @IsNotEmpty()
    template_id: string;

    @IsString()
    @IsOptional()
    created_by?: string;

    @IsString()
    @IsOptional()
    updated_by?: string;

    constructor(
        title: string,
        description: string,
        space_id: string,
        participant_limit: number,
        max_reward_point: number,
        end_date: Date,
        reattempt: number,
        status: QuestStatus,
        category: QuestCategory,
        template_id: string,
        quest_time?: number,
        created_by?: string,
        updated_by?: string
    ) {
        this.title = title;
        this.description = description;
        this.space_id = space_id;
        this.participant_limit = participant_limit;
        this.max_reward_point = max_reward_point;
        this.end_date = end_date;
        this.reattempt = reattempt;
        this.status = status;
        this.category = category;
        this.template_id = template_id;
        this.quest_time = quest_time;
        this.created_by = created_by;
        this.updated_by = updated_by;
    }
}
