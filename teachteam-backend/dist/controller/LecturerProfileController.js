"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerProfileController = void 0;
const data_source_1 = require("../data-source");
const LecturerProfile_1 = require("../entity/LecturerProfile");
const Lecturer_1 = require("../entity/Lecturer");
class LecturerProfileController {
    constructor() {
        this.lecturerProfileRepository = data_source_1.AppDataSource.getRepository(LecturerProfile_1.LecturerProfile);
        this.lecturerRepository = data_source_1.AppDataSource.getRepository(Lecturer_1.Lecturer);
    }
    /**
     * Retrieves all lecturer profiles from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all lecturers
     */
    async getAll(request, response) {
        const lecturerProfiles = await this.lecturerProfileRepository.find();
        return response.json(lecturerProfiles);
    }
    /**
     * Retrieves a single lecturer profile by their ID
     * @param request - Express request object containing the lecturer ID in params
     * @param response - Express response object
     * @returns JSON response containing the lecturer if found, or 404 error if not found
     */
    async getOne(request, response) {
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
    async create(request, response) {
        const { age, contact, biography, links } = request.body;
        const lecturerProfile = Object.assign(new LecturerProfile_1.LecturerProfile(), {
            age,
            contact,
            biography,
            links,
        });
        try {
            const savedLecturer = await this.lecturerProfileRepository.save(lecturerProfile);
            return response.status(201).json(savedLecturer);
        }
        catch (error) {
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
    async delete(request, response) {
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
    async update(request, response) {
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
        }
        catch (error) {
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
    async getOneLecturer(request, response) {
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
exports.LecturerProfileController = LecturerProfileController;
//async attachCourses(request: Request, response: Response) {
//  const courseIds = request.params.courseIds;
//  const lecturerId = request.params.lecturerId;
//
//  const lecturerProfile = await this.lecturerProfileRepository.findOne({
//    where: { id: lecturerId },
//  });
// }
