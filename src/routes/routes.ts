import {Router} from "express";
import spaceRoutes from "./spaceRoutes";

const rootRouter: Router = Router();

rootRouter.use("/space", spaceRoutes)

export default rootRouter;
