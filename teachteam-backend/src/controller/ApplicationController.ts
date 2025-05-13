import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);

  async create(request: Request, response: Response) {
    const { roles, courseCode, courseName, outcome, expressionOfInterest, note } = request.body;

    const application = Object.assign(new Application(), {
      roles,
      courseCode,
      courseName,
      outcome,
      expressionOfInterest,
      note,
    });

    try {
      const savedApplication = await this.applicationRepository.save(application);
      return response.status(201).json(savedApplication);
    } catch (error) {
      return response.status(400).json({ message: "Error creating application", error });
    }
  }

  async getAll(request: Request, response: Response) {
    try {
      const applications = await this.applicationRepository.find();
      return response.json(applications);
    } catch (error) {
      return response.status(500).json({ message: "Failed to fetch applications", error });
    }
  }
}