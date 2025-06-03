import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";
import { Notification } from "../entity/Notification";

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

  async getByCourse(request: Request, response: Response) {
    const { courseCode } = request.params;
    try {
      const apps = await this.applicationRepository.find({ where: { courseCode } });
      return response.json(apps);
    } catch (e) {
      return response.status(500).json({ message: "Failed to fetch applications by course", error: e});
    }
  }

  async updateOutcome(request: Request, response: Response) {
    const { id } = request.params;
    const { outcome } = request.body;
    try {
      const application = await this.applicationRepository.findOneBy({ id: Number(id) });
      if (!application) {
        return response.status(404).json({ message: "Application not found "});
      }
      application.outcome = outcome;
      const updated = await this.applicationRepository.save(application);

      //Create notification if approved
      if (outcome === "Accepted" || outcome === "Approved") {
        const approvalDate = new Date();
        const startDate = new Date(approvalDate.getTime());
        startDate.setDate(approvalDate.getDate() + 14);
        const message = `Congratulations! Your application for "${application.roles}" in "${application.courseName}" (${application.courseCode}) has been approved. 
        Your expected start date is ${startDate.toLocaleDateString()}.`;

        const notificationRepo = AppDataSource.getRepository(Notification);
        await notificationRepo.save({
          email: application.email,
          applicationId: application.id,
          message,
        });
      }
      
      return response.json(updated);
    } catch (error) {
      return response.status(400).json({ message: "Error updating application", error });
    }
  }
}