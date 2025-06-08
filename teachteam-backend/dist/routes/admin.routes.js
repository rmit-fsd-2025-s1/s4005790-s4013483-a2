"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controller/AdminController");
const router = (0, express_1.Router)();
const adminController = new AdminController_1.AdminController();
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
exports.default = router;
