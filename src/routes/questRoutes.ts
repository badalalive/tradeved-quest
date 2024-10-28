import {container} from "tsyringe";
import {Router} from "express";
import {QuestController} from "../controllers/questController";
import {verifyTokenAndRolesMiddleware} from "../middlewares/authMiddleWare";
import {UserRole} from "../utils/userRole";
import {QuestModuleController} from "../controllers/questModuleController";
import {QuestParticipantController} from "../controllers/questParticipantController";

const questController = container.resolve(QuestController)
const questModuleController = container.resolve(QuestModuleController)
const questParticipantController = container.resolve(QuestParticipantController)

const questRoutes: Router = Router();

// quest creation and update related api
questRoutes.post("/create/:spaceId", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.createQuest);
questRoutes.put("/update/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.updateQuest);
questRoutes.get("/get/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.getQuest);
questRoutes.get("/get-all/:spaceId", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.findQuestsBySpace);
questRoutes.put("/update-status/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.updateQuestStatus);
questRoutes.post("/approval-status/:id", verifyTokenAndRolesMiddleware([UserRole.SUPER_ADMIN]), questController.submitQuestForApproval);
questRoutes.post("/toggle-view/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.toggleView);

// quest module related api
questRoutes.post("/module", questModuleController.create);
questRoutes.put("/module/:id", questModuleController.update);
questRoutes.post("/module/add-quests", questModuleController.addQuests);
questRoutes.delete("/module/remove-quests", questModuleController.removeQuests);
export default questRoutes