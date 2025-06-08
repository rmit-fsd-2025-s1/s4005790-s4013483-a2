"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TutorController_1 = require("../controller/TutorController");
const validate_1 = require("../middleware/validate");
const create_tutor_dto_1 = require("../dtos/create-tutor.dto");
const update_tutor_dto_1 = require("../dtos/update-tutor.dto");
const router = (0, express_1.Router)();
const tutorController = new TutorController_1.TutorController();
router.get("/tutors", async (req, res) => {
    await tutorController.getAll(req, res);
});
router.get("/tutors/:id", async (req, res) => {
    await tutorController.getOne(req, res);
});
router.get("/tutors/email/:email", async (req, res) => {
    await tutorController.getOneEmail(req, res);
});
router.post("/tutors", (0, validate_1.validateDto)(create_tutor_dto_1.CreateTutorDTO), async (req, res) => {
    await tutorController.create(req, res);
});
router.put("/tutors/:id", (0, validate_1.validateDto)(update_tutor_dto_1.UpdateTutorDTO), async (req, res) => {
    await tutorController.update(req, res);
});
router.delete("/tutors/:id", async (req, res) => {
    await tutorController.delete(req, res);
});
exports.default = router;
