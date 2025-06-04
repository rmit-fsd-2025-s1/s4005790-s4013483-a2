import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";

export class LecturerAnalyticsController {
  private applicationRepo = AppDataSource.getRepository(Application);

  async getAnalytics(req: Request, res: Response) {
    try {
      // 1. Fetch all applications
      const apps = await this.applicationRepo.find();

      // 2. Group by applicant email
      const byApplicant: Record<string, Application[]> = {};
      apps.forEach(app => {
        byApplicant[app.email] = byApplicant[app.email] || [];
        byApplicant[app.email].push(app);
      });

      // 3. Count approved applications per applicant
      const stats: { email: string, count: number, lastApprovedApp?: Application }[] = [];
      for (const [email, userApps] of Object.entries(byApplicant)) {
        const approved = userApps.filter(a => a.outcome === "Approved");
        stats.push({
          email,
          count: approved.length,
          lastApprovedApp: approved.length > 0 ? approved[approved.length - 1] : undefined
        });
      }

      // 4. Find most and least (with at least 1 approval)
      const withApprovals = stats.filter(a => a.count > 0);
      let most = null, least = null;
      if (withApprovals.length > 0) {
        most = withApprovals.reduce((a, b) => a.count >= b.count ? a : b);
        least = withApprovals.reduce((a, b) => a.count <= b.count ? a : b);
      }

      // 5. Find applicants never approved
      const neverSelected = stats.filter(a => a.count === 0).map(a => {
        // Find their latest application (Sent or Rejected)
        const lastApp = byApplicant[a.email].reduce((prev, curr) => (prev.id > curr.id ? prev : curr));
        return {
          email: a.email,
          roles: lastApp?.roles,
          courseName: lastApp?.courseName,
          courseCode: lastApp?.courseCode,
          outcome: lastApp?.outcome
        };
      });

      // 6. Return analytics
      res.json({
        most,
        least,
        neverSelected,
        stats: stats.sort((a, b) => b.count - a.count),
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to compute analytics", details: e });
    }
  }
}