import { Router } from "express";
import { TutorController } from "../controller/TutorController";

const router = Router();
const tutorController = new TutorController();

router.get("/lecturers", async (req, res) => {
  await tutorController.all(req, res);
});

router.get("/lecturers/:id", async (req, res) => {
  await tutorController.one(req, res);
});

router.get("/lecturers/:email", async (req, res) => {
  await tutorController.email(req, res);
});

router.post("/lecturers", async (req, res) => {
  await tutorController.save(req, res);
});

router.put("/lecturers/:id", async (req, res) => {
  await tutorController.update(req, res);
});

router.delete("/lecturers/:id", async (req, res) => {
  await tutorController.remove(req, res);
});

export default router;
