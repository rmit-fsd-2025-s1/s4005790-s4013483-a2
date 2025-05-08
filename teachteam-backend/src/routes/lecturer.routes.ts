import { Router } from "express";
import { LecturerController } from "../controller/LecturerController";
import { validateDto } from "src/middleware/validate";
import { UpdateLecturerDTO } from "src/dtos/update-lecturer.dto";
import { CreateLecturerDTO } from "src/dtos/create-lecturer.dto";
const router = Router();
const lecturerController = new LecturerController();

router.get("/lecturers", async (req, res) => {
  await lecturerController.getAll(req, res);
});

router.get("/lecturers/:id", async (req, res) => {
  await lecturerController.getOne(req, res);
});

router.get("/lecturers/email/:email", async (req, res) => {
  await lecturerController.getOneEmail(req, res);
});

router.post("/lecturers", validateDto(CreateLecturerDTO), async (req, res) => {
  await lecturerController.create(req, res);
});

router.put("/lecturers/:id", validateDto(UpdateLecturerDTO), async (req, res) => {
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

export default router;
