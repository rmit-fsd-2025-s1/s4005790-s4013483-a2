import { Router } from "express";
import { LecturerProfileController } from "../controller/LecturerProfileController";
import { validateDto } from "../middleware/validate";
import { UpdateLecturerProfileDto } from "../dto/update-lecturerProfile.dto";

const router = Router();
const lecturerController = new LecturerProfileController();

router.get("/lecturerProfiles", async (req, res) => {
  await lecturerController.getAll(req, res);
});

router.get("/lecturerProfiles/:id", async (req, res) => {
  await lecturerController.getOne(req, res);
});

router.post("/lecturerProfiles", async (req, res) => {
  await lecturerController.create(req, res);
});

router.put("/lecturerProfiles/:id", validateDto(UpdateLecturerProfileDto), async (req, res) => {
  await lecturerController.update(req, res);
});

router.delete("/lecturerProfiles/:id", async (req, res) => {
  await lecturerController.delete(req, res);
});

router.get("/lecturerProfiles/:id/lecturers", async (req, res) => {
  await lecturerController.getOneLecturer(req, res);
});

export default router;
