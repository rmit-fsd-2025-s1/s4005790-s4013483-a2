import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import { Lecturer } from "../entity/Lecturer";
import { LecturerProfile } from "../entity/LecturerProfile";
import { Course } from "../entity/Course";
import { Tutor } from "../entity/Tutor";

const adminRepository = AppDataSource.getRepository(Admin);
const courseRepository = AppDataSource.getRepository(Course);
const lecturerRepository = AppDataSource.getRepository(Lecturer);
const lecturerProfileRepository = AppDataSource.getRepository(LecturerProfile);
const tutorRepository = AppDataSource.getRepository(Tutor);

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
        },
        tutors: async () => {
            const tutors = await tutorRepository.find();
            return tutors;
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
        },
        addCourse: async (_: any, { code, name, skills, description }: { code: string, name: string, skills: string[], description: string }) => {
            const newCourse = await courseRepository.save({ code, name, skills, description });
            return newCourse;
        },
        updateCourse: async (_: any, { code, name, skills, description }: { code: string, name: string, skills: string[], description: string }) => {
            const updatedCourse = await courseRepository.save({ code, name, skills, description });
            return updatedCourse;
        },
        deleteCourse: async (_: any, { code }: { code: string }): Promise<boolean> => {
            const deletedCourse = await courseRepository.delete(code);
            if (deletedCourse.affected) {
                return true;
            }
            return false;
        },
        updateTutorBlocked: async (_: any, { id, blocked }: { id: string, blocked: boolean }) => {
            const tutor = await tutorRepository.findOne({ where: { id: parseInt(id) } });
            if (!tutor) {
                throw new Error("Tutor not found");
            }
            tutor.blocked = blocked;
            return await tutorRepository.save(tutor);
        }
    },
};