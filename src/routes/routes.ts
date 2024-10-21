import {Router} from "express";
import spaceRoutes from "./spaceRoutes";
import questRoutes from "./questRoutes";

const rootRouter: Router = Router();

rootRouter.use("/space", spaceRoutes)
rootRouter.use("/quest", questRoutes)

export default rootRouter;
