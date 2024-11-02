import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class QuestionOptionDTO {
    @IsString()
    @IsNotEmpty()
    question_id: string;

    @IsArray()
    @ArrayMinSize(0)
    @IsString({ each: true })
    selected_options: string[];

    constructor(question_id: string, selected_options: string[]) {
        this.question_id = question_id;
        this.selected_options = selected_options;
    }
}

export class QuestQuestionsWithSelectedOptionsDTO {
    @ValidateNested({ each: true })
    @IsNotEmpty()
    @Type((type) => type?.object.QuestionOptionDTO)
    question: QuestionOptionDTO;

    constructor(question: QuestionOptionDTO) {
        this.question = question;
    }
}

