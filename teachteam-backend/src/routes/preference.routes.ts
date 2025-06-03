import { Router } from "express";
import { PreferenceController } from "../controller/PreferenceController";

const router = Router();
const controller = new PreferenceController();

router.get("/preferences/:courseCode/:lecturerId", (req, res) =>
  controller.getByCourseAndLecturer(req, res)
);

router.post("/preferences/save", (req, res) =>
  controller.saveRankings(req, res)
);

export default router;
