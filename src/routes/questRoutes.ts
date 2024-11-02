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
questRoutes.post("/create", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.createQuest);
questRoutes.put("/update/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR, UserRole.SUPER_ADMIN]), questController.updateQuest);
questRoutes.get("/get/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.findQuest);
// quest VOTE Template user api's
questRoutes.post("/vote/:id/:optionId", verifyTokenAndRolesMiddleware([UserRole.USER]), questController.voteQuest)
questRoutes.get("/voting-article/:id", verifyTokenAndRolesMiddleware([UserRole.USER]), questController.findVoteQuestById)
questRoutes.get("/qna/:id", verifyTokenAndRolesMiddleware([UserRole.USER]), questController.findQnaQuestById)
questRoutes.post("/qna/check-answer/:questId", verifyTokenAndRolesMiddleware([UserRole.USER]), questController.checkAnswerByQuestionId)
questRoutes.post("/qna/submit", verifyTokenAndRolesMiddleware([UserRole.USER]), questController.submitQuestionAnswer)
// admin api
questRoutes.put("/update-status/:id", verifyTokenAndRolesMiddleware([UserRole.SUPER_ADMIN]), questController.updateQuestStatus);
questRoutes.post("/approval-status/:id", verifyTokenAndRolesMiddleware([UserRole.SUPER_ADMIN]), questController.submitQuestForApproval);
questRoutes.put("/publish/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.publishQuest);
questRoutes.get("/get-all", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.findQuestsBySpace);
questRoutes.get("/all", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.findAll)
questRoutes.post("/toggle-view/:id", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.toggleView);
questRoutes.post("/upload-media", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), questController.uploadMedia);

// quest module related api
questRoutes.post("/module", questModuleController.create);
questRoutes.put("/module/:id", questModuleController.update);
questRoutes.post("/module/add-quests", questModuleController.createQuests);
questRoutes.delete("/module/remove-quests", questModuleController.deleteQuests);
export default questRoutes