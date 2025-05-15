import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TutorProfile } from "../entity/TutorProfile";

export class TutorProfileController {
  private tutorProfileRepository = AppDataSource.getRepository(TutorProfile);

  async getAll(request: Request, response: Response) {
    const profiles = await this.tutorProfileRepository.find();
    return response.json(profiles);
  }

  async getOne(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const profile = await this.tutorProfileRepository.findOne({ where: { id } });

    if (!profile) {
      return response.status(404).json({ message: "Profile not found" });
    }
    return response.json(profile);
  }

  async create(request: Request, response: Response) {
    const { roles, availability, skills, credentials } = request.body;

    const profile = this.tutorProfileRepository.create({
      roles,
      availability,
      skills,
      credentials,
    });

    try {
      const savedProfile = await this.tutorProfileRepository.save(profile);
      return response.status(201).json(savedProfile);
    } catch (error) {
      return response.status(400).json({ message: "Error creating profile", error });
    }
  }

  async update(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { roles, availability, skills, credentials } = request.body;

    let profileToUpdate = await this.tutorProfileRepository.findOne({ where: { id } });

    if (!profileToUpdate) {
      return response.status(404).json({ message: "Profile not found" });
    }

    profileToUpdate = Object.assign(profileToUpdate, {
      roles,
      availability,
      skills,
      credentials,
    });

    try {
      const updatedProfile = await this.tutorProfileRepository.save(profileToUpdate);
      return response.json(updatedProfile);
    } catch (error) {
      return response.status(400).json({ message: "Error updating profile", error });
    }
  }

  async delete(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const profileToRemove = await this.tutorProfileRepository.findOne({ where: { id } });

    if (!profileToRemove) {
      return response.status(404).json({ message: "Profile not found" });
    }

    await this.tutorProfileRepository.remove(profileToRemove);
    return response.json({ message: "Profile removed successfully" });
  }
}