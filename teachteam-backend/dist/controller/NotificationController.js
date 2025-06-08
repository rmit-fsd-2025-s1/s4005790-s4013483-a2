"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const data_source_1 = require("../data-source");
const Notification_1 = require("../entity/Notification");
class NotificationController {
    constructor() {
        this.notificationRepo = data_source_1.AppDataSource.getRepository(Notification_1.Notification);
    }
    async getByEmail(req, res) {
        const { email } = req.params;
        const notifications = await this.notificationRepo.find({
            where: { email, read: false },
            order: { createdAt: "DESC" },
        });
        res.json(notifications);
    }
    async markRead(req, res) {
        const { id } = req.params;
        await this.notificationRepo.update({ id: Number(id) }, { read: true });
        res.json({ success: true });
    }
}
exports.NotificationController = NotificationController;
