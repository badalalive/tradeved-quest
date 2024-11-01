import {ArrayMinSize, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class QuestVoteOptionDTO {

    @IsString()
    option_text: string;

    constructor(option_text: string) {
        this.option_text = option_text;
    }
}
export class QuestVoteDTO {

    @IsString()
    news_item: string;

    @ValidateNested({ each: true })
    @Type((type) => type?.object.QuestVoteOptionDTO)
    @ArrayMinSize(2)
    options: QuestVoteOptionDTO[];

    constructor(news_item: string, options: QuestVoteOptionDTO[]) {
        this.news_item = news_item;
        this.options = options;
    }

}