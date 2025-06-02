import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Preference } from "../entity/Preference";

export class PreferenceController {
  private preferenceRepository = AppDataSource.getRepository(Preference);

  async getByCourseAndLecturer(req: Request, res: Response) {
    const { courseCode, lecturerId } = req.params;
    const preferences = await this.preferenceRepository.find({
      where: { courseCode, lecturerId: Number(lecturerId) },
      order: { preference_rank: "ASC" },
    });
    res.json(preferences);
  }

  async saveRankings(req: Request, res: Response) {
    const { courseCode, lecturerId, rankings } = req.body;
    try {
      await this.preferenceRepository.delete({ courseCode, lecturerId });
      const toSave = rankings.map((r: any) => ({
        courseCode,
        lecturerId,
        applicationId: r.applicationId,
        preference_rank: r.preference_rank ?? r.rank, // Accepts either field from frontend
      }));
      const saved = await this.preferenceRepository.save(toSave);
      res.json(saved);
    } catch (e) {
      res.status(400).json({ message: "Error saving preferences", error: e });
    }
  }
}