import {container} from "tsyringe";
import {SpaceController} from "../controllers/spaceController";
import {SpaceService} from "../service/spaceService";
import {SpaceRepository} from "../repository/spaceRepository";
import {PrismaClient} from "@prisma/client";
import {QuestController} from "../controllers/questController";
import {QuestRepository} from "../repository/questRepository";
import {QuestService} from "../service/questService";
import {TokenRepository} from "../repository/tokenRepository";

export const prisma: PrismaClient = new PrismaClient({
    errorFormat: "minimal",
});

container.register<PrismaClient>("PrismaClient", {
    useValue: prisma,
});

// controllers
container.registerSingleton<SpaceController>("SpaceController", SpaceController);
container.registerSingleton<QuestController>("QuestController", QuestController);
// services
container.registerSingleton<SpaceService>("SpaceService", SpaceService);
container.registerSingleton<QuestService>("QuestService", QuestService);
// repositories
container.registerSingleton<SpaceRepository>("SpaceRepository", SpaceRepository);
container.registerSingleton<QuestRepository>("QuestRepository", QuestRepository);
container.registerSingleton<TokenRepository>("TokenRepository", TokenRepository);