import { Router } from "express";
import { TutorProfileController } from "../controller/TutorProfileController";

const router = Router();
const tutorProfileController = new TutorProfileController();

router.get("/tutor-profiles", async (req, res) => {
  await tutorProfileController.getAll(req, res);
});

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

export default router;