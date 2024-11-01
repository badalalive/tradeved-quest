import {container} from "tsyringe";
import {SpaceController} from "../controllers/spaceController";
import {SpaceService} from "../service/spaceService";
import {SpaceRepository} from "../repository/spaceRepository";
import {PrismaClient} from "@prisma/client";
import {QuestController} from "../controllers/questController";
import {QuestRepository} from "../repository/questRepository";
import {QuestService} from "../service/questService";
import {TokenRepository} from "../repository/tokenRepository";
import {QuestParticipantsRepository} from "../repository/questParticipantsRepository";
import {QuestModuleRepository} from "../repository/questModuleRepository";
import {QuestModuleController} from "../controllers/questModuleController";
import {QuestParticipantController} from "../controllers/questParticipantController";
import {QuestModuleService} from "../service/questModuleService";
import {QuestParticipantService} from "../service/questParticipantService";
import {QuestVoteRepository} from "../repository/questVoteRepository";
import {QuestQNARepository} from "../repository/questQNARepository";

export const prisma: PrismaClient = new PrismaClient({
    errorFormat: "minimal",
});

container.register<PrismaClient>("PrismaClient", {
    useValue: prisma,
});

// controllers
container.registerSingleton<SpaceController>("SpaceController", SpaceController);
container.registerSingleton<QuestController>("QuestController", QuestController);
container.registerSingleton<QuestModuleController>("QuestModuleController", QuestModuleController);
container.registerSingleton<QuestParticipantController>("QuestParticipantController", QuestParticipantController);
// services
container.registerSingleton<SpaceService>("SpaceService", SpaceService);
container.registerSingleton<QuestService>("QuestService", QuestService);
container.registerSingleton<QuestModuleService>("QuestModuleService", QuestModuleService);
container.registerSingleton<QuestParticipantService>("QuestParticipantService", QuestParticipantService);
// repositories
container.registerSingleton<SpaceRepository>("SpaceRepository", SpaceRepository);
container.registerSingleton<QuestRepository>("QuestRepository", QuestRepository);
container.registerSingleton<QuestParticipantsRepository>("QuestParticipantsRepository", QuestParticipantsRepository);
container.registerSingleton<QuestModuleRepository>("QuestModuleRepository", QuestModuleRepository);
container.registerSingleton<QuestVoteRepository>("QuestVoteRepository", QuestVoteRepository);
container.registerSingleton<QuestQNARepository>("QuestQNARepository", QuestQNARepository);
container.registerSingleton<TokenRepository>("TokenRepository", TokenRepository);