"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TutorProfileController_1 = require("../controller/TutorProfileController");
const router = (0, express_1.Router)();
const tutorProfileController = new TutorProfileController_1.TutorProfileController();
router.get("/tutor-profiles/:id", async (req, res) => {
    await tutorProfileController.getOne(req, res);
});
router.post("/tutor-profiles", async (req, res) => {
    await tutorProfileController.create(req, res);
});
router.put("/tutor-profiles/:id", async (req, res) => {
    await tutorProfileController.update(req, res);
});
router.delete("/tutor-profiles/:id", async (req, res) => {
    await tutorProfileController.delete(req, res);
});
router.get("/tutor-profiles", async (req, res) => {
    if (req.query.email) {
        await tutorProfileController.getByEmail(req, res);
    }
    else {
        await tutorProfileController.getAll(req, res);
    }
});
router.post("/tutor-profiles/upsert", async (req, res) => {
    await tutorProfileController.upsertByEmail(req, res);
});
exports.default = router;
