"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerController = void 0;
const data_source_1 = require("../data-source");
const Lecturer_1 = require("../entity/Lecturer");
const LecturerProfile_1 = require("../entity/LecturerProfile");
const Course_1 = require("../entity/Course");
class LecturerController {
    constructor() {
        this.lecturerRepository = data_source_1.AppDataSource.getRepository(Lecturer_1.Lecturer);
        this.lecturerProfileRepository = data_source_1.AppDataSource.getRepository(LecturerProfile_1.LecturerProfile);
    }
    /**
     * Retrieves all lecturers from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all lecturers
     */
    async getAll(request, response) {
        const lecturers = await this.lecturerRepository.find();
        return response.json(lecturers);
    }
    /**
     * Retrieves a single lecturer by their ID
     * @param request - Express request object containing the lecturer ID in params
     * @param response - Express response object
     * @returns JSON response containing the lecturer if found, or 404 error if not found
     */
    async getOne(request, response) {
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
    async getOneEmail(request, response) {
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
    async create(request, response) {
        const { name, email, password } = request.body;
        try {
            const lecturer = Object.assign(new Lecturer_1.Lecturer(), {
                name,
                email,
                password,
                profile: Object.assign(new LecturerProfile_1.LecturerProfile(), {
                    age: 0,
                    contact: "",
                    biography: "",
                    links: ""
                })
            });
            const savedLecturer = await this.lecturerRepository.save(lecturer);
            return response.status(201).json(savedLecturer);
        }
        catch (error) {
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
    async delete(request, response) {
        const id = parseInt(request.params.id);
        const lecturerToRemove = await this.lecturerRepository.findOne({
            where: { id },
        });
        if (!lecturerToRemove) {
            return response.status(404).json({ message: "Lecturer not found" });
        }
        try {
            await this.lecturerRepository.remove(lecturerToRemove);
            await this.lecturerProfileRepository.remove(lecturerToRemove.profile);
            return response.json({ message: "Lecturer removed successfully" });
        }
        catch (error) {
            return response
                .status(500)
                .json({ message: "Error removing lecturer", error });
        }
    }
    /**
     * Updates an existing lecturer's information
     * @param request - Express request object containing lecturer ID in params and updated details in body
     * @param response - Express response object
     * @returns JSON response containing the updated lecturer or error message
     */
    async update(request, response) {
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
        }
        catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating lecturer", error });
        }
    }
    /**
   * Attaches a profile to a lecturer and a lecturer to a profile
   * @param req - Express request object containing lecturer_id and profile_id in params
   * @param res - Express response object
   * @returns JSON object of the updated lecturer and profile or 404 if lecturer/profile not found
   */
    async attachProfile(request, response) {
        const lecturer = await this.lecturerRepository.findOne({
            where: { id: parseInt(request.params.id) },
            relations: ["profile"],
        });
        if (!lecturer) {
            return response.status(404).json({ message: "Lecturer not found" });
        }
        // Find profile
        const profile = await this.lecturerProfileRepository.findOneBy({
            id: parseInt(request.params.profileId),
        });
        if (!profile) {
            return response.status(404).json({ message: "Lecturer profie not found" });
        }
        lecturer.profile = profile;
        profile.lecturer = lecturer;
        // Save the updated pet
        try {
            await this.lecturerRepository.save(lecturer);
            await this.lecturerProfileRepository.save(profile);
            response.json(lecturer);
        }
        catch (error) {
            return response
                .status(500)
                .json({ message: "Error attaching profile to pet", error });
        }
    }
    /**
   * Retrieves the profile associated with a specific lecturer
   * @param request - Express request object containing the lecturer ID in params
   * @param response - Express response object
   * @returns JSON response containing the lecturer if found, or 404 error if not found
   */
    async getOneProfile(request, response) {
        const lecturer = await this.lecturerRepository.findOneBy({
            id: parseInt(request.params.id),
        });
        if (!lecturer) {
            return response.status(404).json({ message: "Lecturer profile not found" });
        }
        const profile = await this.lecturerProfileRepository.findOne({
            where: { lecturer: { id: lecturer.id } },
        });
        if (!profile) {
            return response.status(404).json({ message: "Lecturer profile not found" });
        }
        return response.json(profile);
    }
    async getCoursesByLecturerEmail(request, response) {
        const email = request.params.email;
        try {
            const lecturer = await this.lecturerRepository.findOne({
                where: { email },
                relations: ["profile"],
            });
            if (!lecturer || !lecturer.profile) {
                return response.status(404).json({ message: "Lecturer or profile not found" });
            }
            const lecturerProfileRepo = data_source_1.AppDataSource.getRepository(LecturerProfile_1.LecturerProfile);
            const profile = await lecturerProfileRepo.findOne({
                where: { id: lecturer.profile.id },
                relations: ["courses"],
            });
            if (!profile) {
                return response.status(404).json({ message: "Lecturer profile not found" });
            }
            return response.json(profile.courses || []);
        }
        catch (e) {
            return response.status(500).json({ message: "Failed to fetch courses for lecturer", error: e });
        }
    }
    async assignCoursesToLecturer(request, response) {
        const email = request.params.email;
        const { courseCodes } = request.body;
        try {
            const lecturer = await this.lecturerRepository.findOne({
                where: { email },
                relations: ["profile"],
            });
            if (!lecturer || !lecturer.profile) {
                return response.status(404).json({ message: "Lecturer or profile not found" });
            }
            const courseRepo = data_source_1.AppDataSource.getRepository(Course_1.Course);
            const courses = await courseRepo.findByIds(courseCodes);
            const lecturerProfileRepo = data_source_1.AppDataSource.getRepository(LecturerProfile_1.LecturerProfile);
            const profile = await lecturerProfileRepo.findOne({
                where: { id: lecturer.profile.id },
                relations: ["courses"],
            });
            if (!profile) {
                return response.status(404).json({ message: "Lecturer profile not found" });
            }
            profile.courses = courses;
            await lecturerProfileRepo.save(profile);
            return response.json(profile.courses);
        }
        catch (e) {
            return response.status(500).json({ message: "Failed to assign courses to lecturer", error: e });
        }
    }
}
exports.LecturerController = LecturerController;
