import { Router } from "express";
import { AdminController } from "../controller/AdminController";

const router = Router();
const adminController = new AdminController();

router.get("/admins", async (req, res) => {
  await adminController.getAll(req, res);
});

router.get("/admins/:id", async (req, res) => {
  await adminController.getOne(req, res);
});

router.post("/admins", async (req, res) => {
  await adminController.create(req, res);
});

router.delete("/admins/:id", async (req, res) => {
  await adminController.delete(req, res);
});

export default router;
