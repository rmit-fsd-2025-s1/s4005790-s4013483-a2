import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";

export class AdminController {
  private adminRepository = AppDataSource.getRepository(Admin);

  /**
   * Retrieves all admins from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all admins
   */
  async getAll(request: Request, response: Response) {
    const lecturers = await this.adminRepository.find();

    return response.json(lecturers);
  }

  /**
   * Retrieves a single admin by their ID
   * @param request - Express request object containing the admin ID in params
   * @param response - Express response object
   * @returns JSON response containing the admin if found, or 404 error if not found
   */
  async getOne(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      return response.status(404).json({ message: "Admin not found" });
    }
    return response.json(admin);
  }

  /**
   * Creates a new admin in the database
   * @param request - Express request object containing admin details in body
   * @param response - Express response object
   * @returns JSON response containing the created admin or error message
   */
  async create(request: Request, response: Response) {
    const { name, password } = request.body;

    try {
      const admin = Object.assign(new Admin(), {
        name,
        password,
      });

      const savedAdmin = await this.adminRepository.save(admin);
      return response.status(201).json(savedAdmin);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating admin", error });
    }
  }

  /**
   * Deletes a admin from the database by their ID
   * @param request - Express request object containing the admin ID in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if admin not found
   */
  async delete(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const adminToRemove = await this.adminRepository.findOne({
      where: { id },
    });

    if (!adminToRemove) {
      return response.status(404).json({ message: "Admin not found" });
    }

    try {
      await this.adminRepository.remove(adminToRemove);

      return response.json({ message: "Admin removed successfully" });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error removing admin", error });
    }
  }
}