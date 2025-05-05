import { Router } from "express";
import { TutorController } from "../controller/TutorController";

const router = Router();
const tutorController = new TutorController();

router.get("/tutors", async (req, res) => {
  await tutorController.all(req, res);
});

router.get("/tutors/:id", async (req, res) => {
  await tutorController.one(req, res);
});

router.get("/tutors/:email", async (req, res) => {
  await tutorController.email(req, res);
});

router.post("/tutors", async (req, res) => {
  await tutorController.save(req, res);
});

router.put("/tutors/:id", async (req, res) => {
  await tutorController.update(req, res);
});

router.delete("/tutors/:id", async (req, res) => {
  await tutorController.remove(req, res);
});

export default router;
