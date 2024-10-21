import {container} from "tsyringe";
import {Router} from "express";
import {QuestController} from "../controllers/questController";

const questController = container.resolve(QuestController)

const questRoutes: Router = Router();

export default questRoutes