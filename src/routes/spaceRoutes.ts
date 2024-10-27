import {container} from "tsyringe";
import {Router} from "express";
import {SpaceController} from "../controllers/spaceController";
import {validateTokenMiddleware, verifyTokenAndRolesMiddleware} from "../middlewares/authMiddleWare";
import {UserRole} from "../utils/userRole";


const spaceController = container.resolve(SpaceController);

const spaceRoutes: Router = Router();

spaceRoutes.post("/create/:token", validateTokenMiddleware, spaceController.create)
spaceRoutes.get("/details/:id", spaceController.getSpace)
spaceRoutes.get("/all", spaceController.getAll)
spaceRoutes.put("/upload-documents/:token", validateTokenMiddleware, spaceController.uploadDocuments)
spaceRoutes.post("/space-creation-link", spaceController.sentSpaceCreationLink)
spaceRoutes.post("/verify-space-link/:token", validateTokenMiddleware, spaceController.verifySpaceLink)
spaceRoutes.put("/upload-logo/:token", validateTokenMiddleware, spaceController.addLogo)
spaceRoutes.put("/upload-banner/:token", validateTokenMiddleware, spaceController.addBanner)
spaceRoutes.put("/status/:id/:type", spaceController.updateStatus)
spaceRoutes.post("/submit/:token", validateTokenMiddleware, spaceController.submitSpaceForm)

export default spaceRoutes;


