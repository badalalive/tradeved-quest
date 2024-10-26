"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const express_1 = require("express");
const spaceController_1 = require("../controllers/spaceController");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const spaceController = tsyringe_1.container.resolve(spaceController_1.SpaceController);
const spaceRoutes = (0, express_1.Router)();
spaceRoutes.post("/create/:token", authMiddleWare_1.validateTokenMiddleware, spaceController.create);
spaceRoutes.get("/details/:id", spaceController.getSpace);
spaceRoutes.put("/upload-documents/:token", authMiddleWare_1.validateTokenMiddleware, spaceController.uploadDocuments);
spaceRoutes.post("/space-creation-link", spaceController.sentSpaceCreationLink);
spaceRoutes.post("/verify-space-link/:token", authMiddleWare_1.validateTokenMiddleware, spaceController.verifySpaceLink);
spaceRoutes.put("/upload-logo/:token", authMiddleWare_1.validateTokenMiddleware, spaceController.addLogo);
spaceRoutes.put("/upload-banner/:token", authMiddleWare_1.validateTokenMiddleware, spaceController.addBanner);
spaceRoutes.put("/status/:id/:type", spaceController.updateStatus);
spaceRoutes.post("/submit/:token", authMiddleWare_1.validateTokenMiddleware, spaceController.submitSpaceForm);
exports.default = spaceRoutes;
