import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";
import { validateDto } from "../middleware/validate";
import { CreateApplicationDTO } from "../dtos/create-application.dto";

const router = Router();
const applicationController = new ApplicationController();

router.post("/applications", validateDto(CreateApplicationDTO), async (req, res) => {
  await applicationController.create(req, res);
});

router.get("/applications", async (req, res) => {
  await applicationController.getAll(req, res);
});

router.get("/applications/email/:email", async (req, res) => {
  await applicationController.getByEmail(req, res);
});

export default router;