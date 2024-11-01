import {IsString} from "class-validator";

export class QuestVoteDTO {

    @IsString()
    news_item: string

    constructor(news_item: string) {
        this.news_item = news_item
    }

}