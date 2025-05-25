import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);

  async create(request: Request, response: Response) {
    const { roles, courseCode, courseName, outcome, expressionOfInterest, note, email, courseSkills, tutorSkills, skillsFulfilled } = request.body;

    const application = Object.assign(new Application(), {
      roles,
      courseCode,
      courseName,
      outcome,
      expressionOfInterest,
      note,
      email,
      courseSkills,
      tutorSkills,
      skillsFulfilled,
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

  // Add this method to get apps by email
  async getByEmail(request: Request, response: Response) {
    const { email } = request.params;
    try {
      const applications = await this.applicationRepository.find({ where: { email } });
      return response.json(applications);
    } catch (error) {
      return response.status(500).json({ message: "Failed to fetch applications", error });
    }
  }

  async deleteById(request: Request, response: Response) {
    const { id } = request.params;
    try {
      const result = await this.applicationRepository.delete(id);
      if (result.affected === 0) {
        return response.status(404).json({ message: "Application not found" });
      }
      return response.status(204).send();
    } catch (error) {
      return response.status(500).json({ message: "Failed to delete application", error });    }
  }
}