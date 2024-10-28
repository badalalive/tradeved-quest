"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const tsyringe_1 = require("tsyringe");
const spaceController_1 = require("../controllers/spaceController");
const spaceService_1 = require("../service/spaceService");
const spaceRepository_1 = require("../repository/spaceRepository");
const client_1 = require("@prisma/client");
const questController_1 = require("../controllers/questController");
const questRepository_1 = require("../repository/questRepository");
const questService_1 = require("../service/questService");
const tokenRepository_1 = require("../repository/tokenRepository");
const questParticipantsRepository_1 = require("../repository/questParticipantsRepository");
const questModuleRepository_1 = require("../repository/questModuleRepository");
const questModuleController_1 = require("../controllers/questModuleController");
const questParticipantController_1 = require("../controllers/questParticipantController");
const questModuleService_1 = require("../service/questModuleService");
const questParticipantService_1 = require("../service/questParticipantService");
exports.prisma = new client_1.PrismaClient({
    errorFormat: "minimal",
});
tsyringe_1.container.register("PrismaClient", {
    useValue: exports.prisma,
});
// controllers
tsyringe_1.container.registerSingleton("SpaceController", spaceController_1.SpaceController);
tsyringe_1.container.registerSingleton("QuestController", questController_1.QuestController);
tsyringe_1.container.registerSingleton("QuestModuleController", questModuleController_1.QuestModuleController);
tsyringe_1.container.registerSingleton("QuestParticipantController", questParticipantController_1.QuestParticipantController);
// services
tsyringe_1.container.registerSingleton("SpaceService", spaceService_1.SpaceService);
tsyringe_1.container.registerSingleton("QuestService", questService_1.QuestService);
tsyringe_1.container.registerSingleton("QuestModuleService", questModuleService_1.QuestModuleService);
tsyringe_1.container.registerSingleton("QuestParticipantService", questParticipantService_1.QuestParticipantService);
// repositories
tsyringe_1.container.registerSingleton("SpaceRepository", spaceRepository_1.SpaceRepository);
tsyringe_1.container.registerSingleton("QuestRepository", questRepository_1.QuestRepository);
tsyringe_1.container.registerSingleton("QuestParticipantsRepository", questParticipantsRepository_1.QuestParticipantsRepository);
tsyringe_1.container.registerSingleton("QuestModuleRepository", questModuleRepository_1.QuestModuleRepository);
tsyringe_1.container.registerSingleton("TokenRepository", tokenRepository_1.TokenRepository);
