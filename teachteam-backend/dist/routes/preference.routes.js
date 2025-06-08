"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PreferenceController_1 = require("../controller/PreferenceController");
const router = (0, express_1.Router)();
const controller = new PreferenceController_1.PreferenceController();
router.get("/preferences/:courseCode/:lecturerId", (req, res) => controller.getByCourseAndLecturer(req, res));
router.post("/preferences/save", (req, res) => controller.saveRankings(req, res));
exports.default = router;
