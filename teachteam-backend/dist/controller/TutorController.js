"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorController = void 0;
const data_source_1 = require("../data-source");
const Tutor_1 = require("../entity/Tutor");
class TutorController {
    constructor() {
        this.tutorRepository = data_source_1.AppDataSource.getRepository(Tutor_1.Tutor);
    }
    /**
     * Retrieves all tutors from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all tutors
     */
    async getAll(request, response) {
        const tutors = await this.tutorRepository.find();
        return response.json(tutors);
    }
    /**
     * Retrieves a single tutor by their ID
     * @param request - Express request object containing the tutor ID in params
     * @param response - Express response object
     * @returns JSON response containing the tutor if found, or 404 error if not found
     */
    async getOne(request, response) {
        const id = parseInt(request.params.id);
        const tutors = await this.tutorRepository.findOne({
            where: { id },
        });
        if (!tutors) {
            return response.status(404).json({ message: "Tutor not found" });
        }
        return response.json(tutors);
    }
    /**
   * Retrieves a single tutor by their email
   * @param request - Express request object containing the tutor email in params
   * @param response - Express response object
   * @returns JSON response containing the tutor if found, or 404 error if not found
   */
    async getOneEmail(request, response) {
        const email = request.params.email;
        const tutor = await this.tutorRepository.findOne({
            where: { email },
        });
        if (!tutor) {
            return response.status(404).json({ message: "Tutor not found" });
        }
        return response.json(tutor);
    }
    /**
     * Creates a new tutor in the database
     * @param request - Express request object containing tutor details in body
     * @param response - Express response object
     * @returns JSON response containing the created tutor or error message
     */
    async create(request, response) {
        const { name, email, password } = request.body;
        const tutor = Object.assign(new Tutor_1.Tutor(), {
            name,
            email,
            password,
        });
        try {
            const savedTutor = await this.tutorRepository.save(tutor);
            return response.status(201).json(savedTutor);
        }
        catch (error) {
            return response
                .status(400)
                .json({ message: "Error creating tutor", error });
        }
    }
    /**
     * Deletes a tutor from the database by their ID
     * @param request - Express request object containing the tutor ID in params
     * @param response - Express response object
     * @returns JSON response with success message or 404 error if tutor not found
     */
    async delete(request, response) {
        const id = parseInt(request.params.id);
        const tutorToRemove = await this.tutorRepository.findOne({
            where: { id },
        });
        if (!tutorToRemove) {
            return response.status(404).json({ message: "Tutor not found" });
        }
        await this.tutorRepository.remove(tutorToRemove);
        return response.json({ message: "Tutor removed successfully" });
    }
    /**
     * Updates an existing tutor's information
     * @param request - Express request object containing tutor ID in params and updated details in body
     * @param response - Express response object
     * @returns JSON response containing the updated tutor or error message
     */
    async update(request, response) {
        const id = parseInt(request.params.id);
        const { name, email, password } = request.body;
        let tutorToUpdate = await this.tutorRepository.findOne({
            where: { id },
        });
        if (!tutorToUpdate) {
            return response.status(404).json({ message: "Tutor not found" });
        }
        tutorToUpdate = Object.assign(tutorToUpdate, {
            name,
            email,
            password,
        });
        try {
            const updatedTutor = await this.tutorRepository.save(tutorToUpdate);
            return response.json(updatedTutor);
        }
        catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating tutor", error });
        }
    }
}
exports.TutorController = TutorController;
