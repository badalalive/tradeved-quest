"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const express_1 = require("express");
const questController_1 = require("../controllers/questController");
const questController = tsyringe_1.container.resolve(questController_1.QuestController);
const questRoutes = (0, express_1.Router)();
exports.default = questRoutes;
