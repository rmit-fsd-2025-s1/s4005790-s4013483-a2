import { Router } from "express";
import { TutorController } from "../controller/TutorController";
import { validateDto } from "src/middleware/validate";
import { CreateTutorDTO } from "src/dtos/create-tutor.dto";
import { UpdateTutorDTO } from "src/dtos/update-tutor.dto";

const router = Router();
const tutorController = new TutorController();

router.get("/tutors", async (req, res) => {
  await tutorController.getAll(req, res);
});

router.get("/tutors/:id", async (req, res) => {
  await tutorController.getOne(req, res);
});

router.get("/tutors/email/:email", async (req, res) => {
  await tutorController.getOneEmail(req, res);
});

router.post("/tutors", validateDto(CreateTutorDTO), async (req, res) => {
  await tutorController.create(req, res);
});

router.put("/tutors/:id", validateDto(UpdateTutorDTO), async (req, res) => {
  await tutorController.update(req, res);
});

router.delete("/tutors/:id", async (req, res) => {
  await tutorController.delete(req, res);
});

export default router;
