import {inject, injectable} from "tsyringe";
import {QuestParticipantService} from "../service/questParticipantService";

@injectable()
export class QuestParticipantController {
    constructor(
        @inject("QuestParticipantService")
        private questParticipantService: QuestParticipantService
    ) {}
}