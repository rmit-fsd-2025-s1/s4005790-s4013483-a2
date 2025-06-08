"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceController = void 0;
const data_source_1 = require("../data-source");
const Preference_1 = require("../entity/Preference");
class PreferenceController {
    constructor() {
        this.preferenceRepository = data_source_1.AppDataSource.getRepository(Preference_1.Preference);
    }
    async getByCourseAndLecturer(req, res) {
        const { courseCode, lecturerId } = req.params;
        const { role } = req.query; // get role from query param
        const where = { courseCode, lecturerId: Number(lecturerId) };
        if (role)
            where.role = role;
        const preferences = await this.preferenceRepository.find({
            where,
            order: { preference_rank: "ASC" },
        });
        res.json(preferences);
    }
    async saveRankings(req, res) {
        const { courseCode, lecturerId, role, rankings } = req.body;
        try {
            // Delete only the preferences for this course/lecturer/role
            await this.preferenceRepository.delete({ courseCode, lecturerId, role });
            const toSave = rankings.map((r) => ({
                courseCode,
                lecturerId,
                role,
                applicationId: r.applicationId,
                preference_rank: r.preference_rank ?? r.rank,
            }));
            const saved = await this.preferenceRepository.save(toSave);
            res.json(saved);
        }
        catch (e) {
            res.status(400).json({ message: "Error saving preferences", error: e });
        }
    }
}
exports.PreferenceController = PreferenceController;
