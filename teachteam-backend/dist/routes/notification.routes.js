"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController_1 = require("../controller/NotificationController");
const router = (0, express_1.Router)();
const controller = new NotificationController_1.NotificationController();
router.get("/notifications/:email", (req, res) => controller.getByEmail(req, res));
router.patch("/notifications/:id/read", (req, res) => controller.markRead(req, res));
exports.default = router;
