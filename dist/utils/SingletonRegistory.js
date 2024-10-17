"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const tsyringe_1 = require("tsyringe");
const spaceController_1 = require("../controllers/spaceController");
const spaceService_1 = require("../service/spaceService");
const spaceRepository_1 = require("../repository/spaceRepository");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    errorFormat: "minimal",
});
tsyringe_1.container.register("PrismaClient", {
    useValue: exports.prisma,
});
// controllers
tsyringe_1.container.registerSingleton("SpaceController", spaceController_1.SpaceController);
// services
tsyringe_1.container.registerSingleton("SpaceService", spaceService_1.SpaceService);
// repositories
tsyringe_1.container.registerSingleton("SpaceRepository", spaceRepository_1.SpaceRepository);
