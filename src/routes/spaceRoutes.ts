import {container} from "tsyringe";
import {Router} from "express";
import {SpaceController} from "../controllers/spaceController";
import {validateTokenMiddleware, verifyTokenAndRolesMiddleware} from "../middlewares/authMiddleWare";
import {UserRole} from "../utils/userRole";


const spaceController = container.resolve(SpaceController);

const spaceRoutes: Router = Router();

spaceRoutes.post("/create/:token", validateTokenMiddleware, spaceController.create)
spaceRoutes.put("/update", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), spaceController.update)
spaceRoutes.get("/details", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), spaceController.findSpace)
spaceRoutes.get("/all", spaceController.findAll)
spaceRoutes.put("/upload-documents/:token", validateTokenMiddleware, spaceController.uploadDocuments)
spaceRoutes.post("/space-creation-link", spaceController.sentSpaceCreationLink)
spaceRoutes.post("/verify-space-link/:token", validateTokenMiddleware, spaceController.verifySpaceLink)
spaceRoutes.put("/upload-logo/:token", validateTokenMiddleware, spaceController.createLogo)
spaceRoutes.put("/update-logo", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), spaceController.updateLogo)
spaceRoutes.put("/upload-banner", verifyTokenAndRolesMiddleware([UserRole.SPACE_CREATOR]), spaceController.createBanner)
spaceRoutes.put("/status/:id/:type", spaceController.updateStatus)
spaceRoutes.post("/submit/:token", validateTokenMiddleware, spaceController.submitSpaceForm)

export default spaceRoutes;


