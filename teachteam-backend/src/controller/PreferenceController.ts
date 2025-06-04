import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Preference } from "../entity/Preference";

export class PreferenceController {
  private preferenceRepository = AppDataSource.getRepository(Preference);

  async getByCourseAndLecturer(req: Request, res: Response) {
    const { courseCode, lecturerId } = req.params;
    const { role } = req.query; // get role from query param
    const where: any = { courseCode, lecturerId: Number(lecturerId) };
    if (role) where.role = role;
    const preferences = await this.preferenceRepository.find({
      where,
      order: { preference_rank: "ASC" },
    });
    res.json(preferences);
  }

  async saveRankings(req: Request, res: Response) {
    const { courseCode, lecturerId, role, rankings } = req.body;
    try {
      // Delete only the preferences for this course/lecturer/role
      await this.preferenceRepository.delete({ courseCode, lecturerId, role });
      const toSave = rankings.map((r: any) => ({
        courseCode,
        lecturerId,
        role,
        applicationId: r.applicationId,
        preference_rank: r.preference_rank ?? r.rank,
      }));
      const saved = await this.preferenceRepository.save(toSave);
      res.json(saved);
    } catch (e) {
      res.status(400).json({ message: "Error saving preferences", error: e });
    }
  }
}