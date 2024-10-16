import {container} from "tsyringe";
import {SpaceController} from "../controllers/spaceController";
import {SpaceService} from "../service/spaceService";
import {SpaceRepository} from "../repository/spaceRepository";
import {PrismaClient} from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient({
    errorFormat: "minimal",
});

container.register<PrismaClient>("PrismaClient", {
    useValue: prisma,
});

// controllers
container.registerSingleton<SpaceController>("SpaceController", SpaceController);
// services
container.registerSingleton<SpaceService>("SpaceService", SpaceService);
// repositories
container.registerSingleton<SpaceRepository>("SpaceRepository", SpaceRepository);