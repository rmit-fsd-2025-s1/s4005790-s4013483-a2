"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const data_source_1 = require("../data-source");
const Admin_1 = require("../entity/Admin");
const Lecturer_1 = require("../entity/Lecturer");
const LecturerProfile_1 = require("../entity/LecturerProfile");
const Course_1 = require("../entity/Course");
const Tutor_1 = require("../entity/Tutor");
const Application_1 = require("../entity/Application");
const schema_1 = require("./schema");
const adminRepository = data_source_1.AppDataSource.getRepository(Admin_1.Admin);
const courseRepository = data_source_1.AppDataSource.getRepository(Course_1.Course);
const lecturerRepository = data_source_1.AppDataSource.getRepository(Lecturer_1.Lecturer);
const lecturerProfileRepository = data_source_1.AppDataSource.getRepository(LecturerProfile_1.LecturerProfile);
const tutorRepository = data_source_1.AppDataSource.getRepository(Tutor_1.Tutor);
const applicationRepository = data_source_1.AppDataSource.getRepository(Application_1.Application);
exports.resolvers = {
    Query: {
        admins: async () => {
            const admins = await adminRepository.find();
            return admins;
        },
        courses: async () => {
            const courses = await courseRepository.find();
            return courses;
        },
        lecturers: async () => {
            const lecturers = await lecturerRepository.find();
            return lecturers;
        },
        lecturerProfile: async () => {
            const lecturerProfiles = await lecturerProfileRepository.find();
            return lecturerProfiles;
        },
        lecturerProfileCourses: async (_, { lecturerProfileId }) => {
            const lecturerProfile = await lecturerProfileRepository.findOne({
                where: { id: parseInt(lecturerProfileId) },
                relations: ["courses"],
            });
            return lecturerProfile?.courses || [];
        },
        tutors: async () => {
            const tutors = await tutorRepository.find();
            return tutors;
        },
        applications: async () => {
            const applications = await applicationRepository.find();
            return applications;
        }
    },
    Mutation: {
        addCourseToLecturerProfile: async (_, { courseCodes, lecturerProfileId }) => {
            const courses = await courseRepository.findByIds(courseCodes);
            const profile = await lecturerProfileRepository.findOne({
                where: { id: parseInt(lecturerProfileId) },
                relations: ["courses"],
            });
            if (!profile) {
                throw new Error("Lecturer profile not found");
            }
            profile.courses = courses;
            return await lecturerProfileRepository.save(profile);
        },
        addCourse: async (_, { code, name, skills, description }) => {
            const newCourse = await courseRepository.save({ code, name, skills, description });
            return newCourse;
        },
        updateCourse: async (_, { code, name, skills, description }) => {
            const updatedCourse = await courseRepository.save({ code, name, skills, description });
            return updatedCourse;
        },
        deleteCourse: async (_, { code }) => {
            const deletedCourse = await courseRepository.delete(code);
            if (deletedCourse.affected) {
                return true;
            }
            return false;
        },
        updateTutorBlocked: async (_, { id, blocked }) => {
            const tutor = await tutorRepository.findOne({ where: { id: parseInt(id) } });
            if (!tutor) {
                throw new Error("Tutor not found");
            }
            tutor.blocked = blocked;
            if (blocked) {
                schema_1.pubsub.publish(`TUTOR_UNAVAILABLE`, { tutorUnavailable: tutor });
            }
            return await tutorRepository.save(tutor);
        }
    },
    Subscription: {
        tutorUnavailable: {
            subscribe: () => {
                return schema_1.pubsub.asyncIterator(`TUTOR_UNAVAILABLE`);
            },
        },
    },
};
