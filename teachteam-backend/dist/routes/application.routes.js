"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApplicationController_1 = require("../controller/ApplicationController");
const validate_1 = require("../middleware/validate");
const create_application_dto_1 = require("../dtos/create-application.dto");
const router = (0, express_1.Router)();
const applicationController = new ApplicationController_1.ApplicationController();
router.post("/applications", (0, validate_1.validateDto)(create_application_dto_1.CreateApplicationDTO), async (req, res) => {
    await applicationController.create(req, res);
});
router.get("/applications", async (req, res) => {
    await applicationController.getAll(req, res);
});
router.get("/applications/email/:email", async (req, res) => {
    await applicationController.getByEmail(req, res);
});
router.delete("/applications/:id", async (req, res) => {
    await applicationController.deleteById(req, res);
});
// FIX: Add missing PATCH endpoint to update outcome
router.patch("/applications/:id", async (req, res) => {
    await applicationController.updateOutcome(req, res);
});
router.get("/applications/course/:courseCode", async (req, res) => {
    await applicationController.getByCourse(req, res);
});
exports.default = router;
