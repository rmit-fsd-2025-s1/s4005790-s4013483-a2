import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Lecturer } from "../entity/Lecturer";

export class LecturerController {
  private lecturerRepository = AppDataSource.getRepository(Lecturer);

  /**
   * Retrieves all lecturers from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all lecturers
   */
  async getAll(request: Request, response: Response) {
    const lecturers = await this.lecturerRepository.find();

    return response.json(lecturers);
  }

  /**
   * Retrieves a single lecturer by their ID
   * @param request - Express request object containing the lecturer ID in params
   * @param response - Express response object
   * @returns JSON response containing the lecturer if found, or 404 error if not found
   */
  async getOne(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const lecturer = await this.lecturerRepository.findOne({
      where: { id },
    });

    if (!lecturer) {
      return response.status(404).json({ message: "Lecturer not found" });
    }
    return response.json(lecturer);
  }

    /**
   * Retrieves a single lecturer by their email
   * @param request - Express request object containing the lecturer email in params
   * @param response - Express response object
   * @returns JSON response containing the lecturer if found, or 404 error if not found
   */
  async getOneEmail(request: Request, response: Response) {
    const email = request.params.email;
    const lecturer = await this.lecturerRepository.findOne({
      where: { email },
    });

    if (!lecturer) {
      return response.status(404).json({ message: "Lecturer not found" });
    }
    return response.json(lecturer);
  }

  /**
   * Creates a new lecturer in the database
   * @param request - Express request object containing lecturer details in body
   * @param response - Express response object
   * @returns JSON response containing the created lecturer or error message
   */
  async add(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const lecturer = Object.assign(new Lecturer(), {
      name,
      email,
      password,
    });

    try {
      const savedLecturer = await this.lecturerRepository.save(lecturer);
      return response.status(201).json(savedLecturer);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating lecturer", error });
    }
  }

  /**
   * Deletes a lecturer from the database by their ID
   * @param request - Express request object containing the lecturer ID in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if lecturer not found
   */
  async delete(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const lecturerToRemove = await this.lecturerRepository.findOne({
      where: { id },
    });

    if (!lecturerToRemove) {
      return response.status(404).json({ message: "Lecturer not found" });
    }

    await this.lecturerRepository.remove(lecturerToRemove);
    return response.json({ message: "Lecturer removed successfully" });
  }

  /**
   * Updates an existing lecturer's information
   * @param request - Express request object containing lecturer ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated lecturer or error message
   */
  async update(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { name, email, password } = request.body;

    let lecturerToUpdate = await this.lecturerRepository.findOne({
      where: { id },
    });

    if (!lecturerToUpdate) {
      return response.status(404).json({ message: "Lecturer not found" });
    }

    lecturerToUpdate = Object.assign(lecturerToUpdate, {
      name,
      email,
      password,
    });

    try {
      const updatedLecturer = await this.lecturerRepository.save(lecturerToUpdate);
      return response.json(updatedLecturer);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating lecturer", error });
    }
  }
}

