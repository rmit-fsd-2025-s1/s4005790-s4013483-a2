import { Router } from "express";
import { NotificationController } from "../controller/NotificationController";
const router = Router();
const controller = new NotificationController();

router.get("/notifications/:email", (req, res) => controller.getByEmail(req, res));
router.patch("/notifications/:id/read", (req, res) => controller.markRead(req, res));

export default router;