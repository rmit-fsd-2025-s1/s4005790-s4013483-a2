import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import { Lecturer } from "../entity/Lecturer";
import { LecturerProfile } from "../entity/LecturerProfile";
import { Course } from "../entity/Course";

const adminRepository = AppDataSource.getRepository(Admin);
const courseRepository = AppDataSource.getRepository(Course);
const lecturerRepository = AppDataSource.getRepository(Lecturer);
const lecturerProfileRepository = AppDataSource.getRepository(LecturerProfile);

export const resolvers = {
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
        lecturerProfileCourses: async (_: any, { lecturerProfileId }: { lecturerProfileId: string }) => {
            const lecturerProfile = await lecturerProfileRepository.findOne({
                where: { id: parseInt(lecturerProfileId) },
                relations: ["courses"],
            });
            return lecturerProfile?.courses || [];
        }
    },
    Mutation: {
        addCourseToLecturerProfile: async (_: any, { courseCodes, lecturerProfileId }: { courseCodes: string[], lecturerProfileId: string }) => {
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
        }
    },
};