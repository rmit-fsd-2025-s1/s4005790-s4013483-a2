"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LecturerController_1 = require("../controller/LecturerController");
const validate_1 = require("../middleware/validate");
const update_lecturer_dto_1 = require("../dtos/update-lecturer.dto");
const create_lecturer_dto_1 = require("../dtos/create-lecturer.dto");
const router = (0, express_1.Router)();
const lecturerController = new LecturerController_1.LecturerController();
router.get("/lecturers", async (req, res) => {
    await lecturerController.getAll(req, res);
});
router.get("/lecturers/:id", async (req, res) => {
    await lecturerController.getOne(req, res);
});
router.get("/lecturers/email/:email", async (req, res) => {
    await lecturerController.getOneEmail(req, res);
});
router.post("/lecturers", (0, validate_1.validateDto)(create_lecturer_dto_1.CreateLecturerDTO), async (req, res) => {
    await lecturerController.create(req, res);
});
router.put("/lecturers/:id", (0, validate_1.validateDto)(update_lecturer_dto_1.UpdateLecturerDTO), async (req, res) => {
    await lecturerController.update(req, res);
});
router.delete("/lecturers/:id", async (req, res) => {
    await lecturerController.delete(req, res);
});
router.get("/lecturers/:id/profile", async (req, res) => {
    await lecturerController.getOneProfile(req, res);
});
router.post("/lecturers/:id/profile/:profileId:", async (req, res) => {
    await lecturerController.attachProfile(req, res);
});
router.get("/lecturers/email/:email/courses", async (req, res) => {
    await lecturerController.getCoursesByLecturerEmail(req, res);
});
router.post("/lecturers/email/:email/courses", async (req, res) => {
    await lecturerController.assignCoursesToLecturer(req, res);
});
exports.default = router;
