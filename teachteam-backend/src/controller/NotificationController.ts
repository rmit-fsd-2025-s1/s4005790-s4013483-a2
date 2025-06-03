import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";

export class NotificationController {
  private notificationRepo = AppDataSource.getRepository(Notification);

  async getByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const notifications = await this.notificationRepo.find({
      where: { email, read: false },
      order: { createdAt: "DESC" },
    });
    res.json(notifications);
  }

  async markRead(req: Request, res: Response) {
    const { id } = req.params;
    await this.notificationRepo.update({ id: Number(id) }, { read: true });
    res.json({ success: true });
  }
}