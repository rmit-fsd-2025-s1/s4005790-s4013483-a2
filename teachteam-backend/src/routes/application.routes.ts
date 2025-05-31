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

router.delete("/applications/:id", async (req, res) => {
  await applicationController.deleteById(req, res);
});

// FIX: Add missing PATCH endpoint to update outcome
router.patch("/applications/:id", async (req, res) => {
  await applicationController.updateOutcome(req, res);
});

router.get("/applications/course/:courseCode", async (req, res) => {
  await applicationController.getByCourse(req,res);
});

export default router;