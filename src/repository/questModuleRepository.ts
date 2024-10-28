import {inject, injectable} from "tsyringe";
import {Module, ModuleQuest, PrismaClient, Quest} from "@prisma/client";

@injectable()
export class QuestModuleRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {}

    // create quest module
    async createModule(data: {
        title: string;
        description: string;
        background_color: string;
        created_by: string;
        updated_by: string;
    }): Promise<Module> {
        await this.prismaClient.$connect();

        const newModule = await this.prismaClient.module.create({
            data: {
                title: data.title,
                description: data.description,
                background_color: data.background_color,
                created_by: data.created_by,
                updated_by: data.updated_by,
            },
        });

        await this.prismaClient.$disconnect();
        return newModule;
    }

    // update quest module
    async updateModule(moduleId: string, updateData: Partial<{
        title: string;
        description: string;
        background_color: string;
        updated_by: string;
    }>): Promise<Module | null> {
        await this.prismaClient.$connect();

        const updatedModule = await this.prismaClient.module.update({
            where: { id: moduleId },
            data: {
                ...updateData,
                updated_at: new Date(),
            },
        });

        await this.prismaClient.$disconnect();
        return updatedModule;
    }

    // find all quest module
    async findModulesWithQuests(): Promise<Module[] | null> {
        await this.prismaClient.$connect();

        const modules = await this.prismaClient.module.findMany({
            include: {
                moduleQuests: {
                    include: {
                        quest: true,
                    },
                },
            },
        });

        await this.prismaClient.$disconnect();
        return modules;
    }

    // Add a quest to a module
    async addQuestsToModule(dataToInsert: any[]): Promise<ModuleQuest[] | null> {
        await this.prismaClient.$connect();

        const moduleQuests = await this.prismaClient.moduleQuest.createMany({
            data: dataToInsert,
            skipDuplicates: true, // Optional: prevents duplicate entries if quest-module pairs already exist
        });

        await this.prismaClient.$disconnect();
        return moduleQuests.count ? dataToInsert : [];
    }

    // Remove a quest from a module
    async removeQuestsFromModule(questIds: string[], moduleIds: string[]): Promise<boolean> {
        await this.prismaClient.$connect();

        const deleteModuleQuest = await this.prismaClient.moduleQuest.deleteMany({
            where: {
                quest_id: { in: questIds },
                module_id: { in: moduleIds },
            },
        });

        await this.prismaClient.$disconnect();
        return deleteModuleQuest.count > 0;
    }

    // Find all quests that belong to a module
    async findQuestsByModule(moduleId: string): Promise<Quest[] | null> {
        await this.prismaClient.$connect();

        const quests = await this.prismaClient.quest.findMany({
            where: {
                moduleQuests: {
                    some: {
                        module_id: moduleId
                    }
                }
            },
            include: {
                moduleQuests: true
            }
        });

        await this.prismaClient.$disconnect();
        return quests;
    }

    // find module by quest
    async findModulesByQuest(questId: string): Promise<Module[] | null> {
        await this.prismaClient.$connect();

        const modules = await this.prismaClient.module.findMany({
            where: {
                moduleQuests: {
                    some: { quest_id: questId },
                },
            },
            include: {
                moduleQuests: true,
            },
        });

        await this.prismaClient.$disconnect();
        return modules;
    }

}