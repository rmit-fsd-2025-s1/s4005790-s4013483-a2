import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courseRepository = AppDataSource.getRepository(Course);
    const courses = await courseRepository.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
};