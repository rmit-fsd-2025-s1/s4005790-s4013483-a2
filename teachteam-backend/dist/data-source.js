"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Admin_1 = require("./entity/Admin");
const Lecturer_1 = require("./entity/Lecturer");
const Tutor_1 = require("./entity/Tutor");
const LecturerProfile_1 = require("./entity/LecturerProfile");
const Course_1 = require("./entity/Course");
const Application_1 = require("./entity/Application");
const TutorProfile_1 = require("./entity/TutorProfile");
const Preference_1 = require("./entity/Preference");
const Notification_1 = require("./entity/Notification");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    username: "S4013483",
    password: "4z7&j$y0*0p9#9o0N0UQg2YQ@s!!qade33lKt0q&Xaoi@Ob5l7",
    database: "S4013483",
    // synchronize: true will automatically create database tables based on entity definitions
    // and update them when entity definitions change. This is useful during development
    // but should be disabled in production to prevent accidental data loss.
    synchronize: true,
    logging: true,
    entities: [Lecturer_1.Lecturer, Tutor_1.Tutor, TutorProfile_1.TutorProfile, LecturerProfile_1.LecturerProfile, Course_1.Course, Application_1.Application, Preference_1.Preference, Notification_1.Notification, Admin_1.Admin],
    migrations: [],
    subscribers: [],
});
