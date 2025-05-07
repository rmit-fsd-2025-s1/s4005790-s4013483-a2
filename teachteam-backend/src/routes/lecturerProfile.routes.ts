import { Router } from "express";
import { LecturerProfileController } from "../controller/LecturerProfileController";

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

router.put("/lecturerProfiles/:id", async (req, res) => {
  await lecturerController.update(req, res);
});

router.delete("/lecturerProfiles/:id", async (req, res) => {
  await lecturerController.delete(req, res);
});

router.get("/lecturerProfiles/:id/lecturers", async (req, res) => {
  await lecturerController.getOneLecturer(req, res);
});

router.get("lecturerProfies/:id/lecturers", async (req, res) => {
  await lecturerController.createLecturer(req, res);
});

router.get("lecturerProfiles/:id/lecturers/:id", async (req, res) => {
  await lecturerController.deleteLecturer(req, res)
});

export default router;
