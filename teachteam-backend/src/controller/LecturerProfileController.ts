import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { LecturerProfile } from "../entity/LecturerProfile";
import { Lecturer } from "../entity/Lecturer";

export class LecturerProfileController {
  private lecturerProfileRepository = AppDataSource.getRepository(LecturerProfile);
  private lecturerRepository = AppDataSource.getRepository(Lecturer);

  /**
   * Retrieves all lecturer profiles from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all lecturers
   */
  async getAll(request: Request, response: Response) {
    const lecturerProfiles = await this.lecturerProfileRepository.find();

    return response.json(lecturerProfiles);
  }

  /**
   * Retrieves a single lecturer profile by their ID
   * @param request - Express request object containing the lecturer ID in params
   * @param response - Express response object
   * @returns JSON response containing the lecturer if found, or 404 error if not found
   */
  async getOne(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const lecturerProfile = await this.lecturerProfileRepository.findOne({
      where: { id },
    });

    if (!lecturerProfile) {
      return response.status(404).json({ message: "Lecturer profile not found" });
    }
    return response.json(lecturerProfile);
  }

  /**
   * Creates a new lecturer profile in the database
   * @param request - Express request object containing lecturer details in body
   * @param response - Express response object
   * @returns JSON response containing the created lecturer or error message
   */
  async create(request: Request, response: Response) {
    const { age, contact, biography, links } = request.body;

    const lecturerProfile = Object.assign(new LecturerProfile(), {
      age,
      contact,
      biography,
      links,
    });

    try {
      const savedLecturer = await this.lecturerProfileRepository.save(lecturerProfile);
      return response.status(201).json(savedLecturer);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating lecturer profile", error });
    }
  }

  /**
   * Deletes a lecturer profile from the database by their ID
   * @param request - Express request object containing the lecturer ID in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if lecturer not found
   */
  async delete(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const lecturerProfileToRemove = await this.lecturerProfileRepository.findOne({
      where: { id },
    });

    if (!lecturerProfileToRemove) {
      return response.status(404).json({ message: "Lecturer profile not found" });
    }

    await this.lecturerProfileRepository.remove(lecturerProfileToRemove);
    return response.json({ message: "Lecturer profile removed successfully" });
  }

  /**
   * Updates an existing lecturer profile's information
   * @param request - Express request object containing lecturer ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated lecturer or error message
   */
  async update(request: Request, response: Response) {
    const id = parseInt(request.params.id);

    const lecturerToUpdate = await this.lecturerProfileRepository.findOne({
      where: { id },
    });

    if (!lecturerToUpdate) {
      return response.status(404).json({ message: "Lecturer profile not found" });
    }

    const updatedProfile = { ...lecturerToUpdate, ...request.body };

    try {
      const savedProfile = await this.lecturerProfileRepository.save(updatedProfile);
      return response.json(savedProfile);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating lecturer profile", error });
    }
  }

    /**
   * Retrieves a lecturer by profile ID
   * @param request - Express request object containing the lecturer ID in params
   * @param response - Express response object
   * @returns JSON response containing the lecturer if found, or 404 error if not found
   */
  async getOneLecturer(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const lecturerProfile = await this.lecturerProfileRepository.findOne({
      where: { id },
    });

    if (!lecturerProfile) {
      return response.status(404).json({ message: "Lecturer profile not found" });
    }

    const lecturer = await this.lecturerRepository.find({
      where: { profile: { id: lecturerProfile.id } },
    });
    return response.json(lecturer);
  }
}

async attachCourses(request: Request, response: Response) {
  const courseIds = request.params.courseIds;
  const lecturerId = request.params.lecturerId;

  const lecturerProfile = await this.lecturerProfileRepository.findOne({
    where: { id: lecturerId },
  });
}

