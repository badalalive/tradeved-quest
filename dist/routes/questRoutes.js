"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const express_1 = require("express");
const questController_1 = require("../controllers/questController");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const userRole_1 = require("../utils/userRole");
const questModuleController_1 = require("../controllers/questModuleController");
const questParticipantController_1 = require("../controllers/questParticipantController");
const questController = tsyringe_1.container.resolve(questController_1.QuestController);
const questModuleController = tsyringe_1.container.resolve(questModuleController_1.QuestModuleController);
const questParticipantController = tsyringe_1.container.resolve(questParticipantController_1.QuestParticipantController);
const questRoutes = (0, express_1.Router)();
// quest creation and update related api
questRoutes.post("/create", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR]), questController.createQuest);
questRoutes.put("/update/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR, userRole_1.UserRole.SUPER_ADMIN]), questController.updateQuest);
questRoutes.get("/get/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR]), questController.findQuest);
// quest VOTE Template user api's
questRoutes.post("/vote/:questVoteId/:optionId", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.USER]), questController.voteQuest);
questRoutes.get("/voting-article/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.USER]), questController.getVoteQuestById);
questRoutes.get("/qna/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.USER]), questController.getQnaQuestById);
// admin api
questRoutes.put("/update-status/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SUPER_ADMIN]), questController.updateQuestStatus);
questRoutes.post("/approval-status/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SUPER_ADMIN]), questController.submitQuestForApproval);
questRoutes.put("/publish/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR]), questController.publishQuest);
questRoutes.get("/get-all", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR]), questController.findQuestsBySpace);
questRoutes.get("/all", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR]), questController.findAll);
questRoutes.post("/toggle-view/:id", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR]), questController.toggleView);
questRoutes.post("/upload-media", (0, authMiddleWare_1.verifyTokenAndRolesMiddleware)([userRole_1.UserRole.SPACE_CREATOR]), questController.uploadMedia);
// quest module related api
questRoutes.post("/module", questModuleController.create);
questRoutes.put("/module/:id", questModuleController.update);
questRoutes.post("/module/add-quests", questModuleController.createQuests);
questRoutes.delete("/module/remove-quests", questModuleController.deleteQuests);
exports.default = questRoutes;
