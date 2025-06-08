"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LecturerProfileController_1 = require("../controller/LecturerProfileController");
const validate_1 = require("../middleware/validate");
const update_lecturerProfile_dto_1 = require("../dtos/update-lecturerProfile.dto");
const router = (0, express_1.Router)();
const lecturerController = new LecturerProfileController_1.LecturerProfileController();
router.get("/lecturerProfiles", async (req, res) => {
    await lecturerController.getAll(req, res);
});
router.get("/lecturerProfiles/:id", async (req, res) => {
    await lecturerController.getOne(req, res);
});
router.post("/lecturerProfiles", async (req, res) => {
    await lecturerController.create(req, res);
});
router.put("/lecturerProfiles/:id", (0, validate_1.validateDto)(update_lecturerProfile_dto_1.UpdateLecturerProfileDto), async (req, res) => {
    await lecturerController.update(req, res);
});
router.delete("/lecturerProfiles/:id", async (req, res) => {
    await lecturerController.delete(req, res);
});
router.get("/lecturerProfiles/:id/lecturers", async (req, res) => {
    await lecturerController.getOneLecturer(req, res);
});
exports.default = router;
