import { Router } from "express";
import { getCourses } from "../controller/course.controller";

const router = Router();

router.get("/courses", getCourses);

export default router;