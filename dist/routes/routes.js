"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const spaceRoutes_1 = __importDefault(require("./spaceRoutes"));
const questRoutes_1 = __importDefault(require("./questRoutes"));
const rootRouter = (0, express_1.Router)();
rootRouter.use("/space", spaceRoutes_1.default);
rootRouter.use("/quest", questRoutes_1.default);
exports.default = rootRouter;
