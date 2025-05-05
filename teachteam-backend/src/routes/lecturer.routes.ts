import { Router } from "express";
import { LecturerController } from "../controller/LecturerController";

const router = Router();
const lecturerController = new LecturerController();

router.get("/lecturers", async (req, res) => {
  await lecturerController.all(req, res);
});

router.get("/lecturers/:id", async (req, res) => {
  await lecturerController.one(req, res);
});

router.get("/lecturers/:email", async (req, res) => {
  await lecturerController.email(req, res);
});

router.post("/lecturers", async (req, res) => {
  await lecturerController.save(req, res);
});

router.put("/lecturers/:id", async (req, res) => {
  await lecturerController.update(req, res);
});

router.delete("/lecturers/:id", async (req, res) => {
  await lecturerController.remove(req, res);
});

export default router;
