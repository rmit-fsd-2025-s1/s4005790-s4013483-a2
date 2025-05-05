import { Router } from "express";
import { LecturerController } from "../controller/LecturerController";

const router = Router();
const lecturerController = new LecturerController();

router.get("/lecturers", async (req, res) => {
  await lecturerController.getAll(req, res);
});

router.get("/lecturers/:id", async (req, res) => {
  await lecturerController.getOne(req, res);
});

router.get("/lecturers/:email", async (req, res) => {
  await lecturerController.getOneEmail(req, res);
});

router.post("/lecturers", async (req, res) => {
  await lecturerController.create(req, res);
});

router.put("/lecturers/:id", async (req, res) => {
  await lecturerController.update(req, res);
});

router.delete("/lecturers/:id", async (req, res) => {
  await lecturerController.delete(req, res);
});

export default router;
