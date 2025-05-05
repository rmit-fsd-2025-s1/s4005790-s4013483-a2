import { Router } from "express";
import { LecturerController } from "../controller/LecturerController";

const router = Router();
const lecturerController = new LecturerController();

router.get("/lecturer", async (req, res) => {
  await lecturerController.all(req, res);
});

router.get("/lecturer/:id", async (req, res) => {
  await lecturerController.one(req, res);
});

router.get("/lecturer/:email", async (req, res) => {
  await lecturerController.email(req, res);
});

router.post("/lecturer", async (req, res) => {
  await lecturerController.save(req, res);
});

router.put("/lecturer/:id", async (req, res) => {
  await lecturerController.update(req, res);
});

router.delete("/lecturer/:id", async (req, res) => {
  await lecturerController.remove(req, res);
});

export default router;
