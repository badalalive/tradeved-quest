import { IsBoolean, IsOptional, IsString, ValidateNested, IsEnum, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerType } from "@prisma/client";

// DTO for options within a question
export class QuestQNAOptionDTO {
    @IsString()
    content: string;

    @IsBoolean()
    isCorrectAnswer: boolean;

    @IsString()
    @IsOptional()
    description?: string;

    constructor(content: string, isCorrectAnswer: boolean, description: string) {
        this.content = content;
        this.isCorrectAnswer = isCorrectAnswer;
        this.description = description;
    }
}

// DTO for a single question with options
export class QuestQNAQuestionDTO {
    @IsString()
    questionText: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(AnswerType)
    answerType: AnswerType;

    @ValidateNested({ each: true })
    @Type((type) => type?.object.QuestQNAOptionDTO)
    @ArrayMinSize(1)
    options: QuestQNAOptionDTO[];

    constructor(
        questionText: string,
        answerType: AnswerType,
        options: QuestQNAOptionDTO[],
        description?: string
    ) {
        this.questionText = questionText;
        this.answerType = answerType;
        this.options = options;
        this.description = description;
    }
}
