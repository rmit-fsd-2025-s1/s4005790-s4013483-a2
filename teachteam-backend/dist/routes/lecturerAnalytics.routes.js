"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LecturerAnalyticsController_1 = require("../controller/LecturerAnalyticsController");
const router = (0, express_1.Router)();
const controller = new LecturerAnalyticsController_1.LecturerAnalyticsController();
router.get("/lecturer-analytics/:lecturerId", (req, res) => controller.getAnalytics(req, res));
exports.default = router;
