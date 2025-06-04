import { Router } from "express";
import { LecturerAnalyticsController } from "../controller/LecturerAnalyticsController";

const router = Router();
const controller = new LecturerAnalyticsController();

router.get("/lecturer-analytics/:lecturerId", (req, res) => controller.getAnalytics(req, res));

export default router;