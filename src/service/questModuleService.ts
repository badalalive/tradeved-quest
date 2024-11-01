import {inject, injectable} from "tsyringe";
import {QuestRepository} from "../repository/questRepository";
import {QuestModuleRepository} from "../repository/questModuleRepository";

@injectable()
export class QuestModuleService {
    constructor(
        @inject("QuestModuleRepository")
        private questModuleRepository: QuestModuleRepository,
    ) {}

    create = async (user_id: string, title: string, description: string, background_color: string) => {
        const module = await this.questModuleRepository.createModule({ title, description, background_color, created_by: user_id, updated_by: user_id});
        return {
            statusCode: 201,
            data: module,
            message: "Module Created"
        }
    }

    update = async (moduleId: string, updateData: Partial<{
        title: string;
        description: string;
        background_color: string;
        updated_by: string;
    }>) => {
        const module = await this.questModuleRepository.updateModule(moduleId, updateData);
        return {
            statusCode: 200,
            data: module,
            message: "Module Updated"
        }
    }

    createQuests = async (moduleQuestsArray: any[]) => {
        const moduleQuests = await this.questModuleRepository.createQuestsToModule(moduleQuestsArray);
        return {
            statusCode: 200,
            data: module,
            message: "Quests Added"
        }
    }

    deleteQuests = async (questIds: string[], moduleIds: string[]) => {
        const removeQuests = await this.questModuleRepository.deleteQuestsFromModule(questIds, moduleIds);
        if (removeQuests) {
            return {
                statusCode: 204,
                data: removeQuests,
                message: "Quests Deleted"
            }
        } else {
            return {
                statusCode: 500,
                data: "",
                message: "Something Went Wrong"
            }
        }

    }
}