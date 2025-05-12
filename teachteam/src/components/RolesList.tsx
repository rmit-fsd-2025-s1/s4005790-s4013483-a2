import { Course } from "@/components/CoursesList";

export interface Role {
  role: "Tutor" | "Lab-Assistant"; // Separate roles for Tutor and Lab-Assistant
  course: Course;
  description: string;
  expressionOfInterest: string;
  note: string;
  status: string;
}

// Generate roles for both Tutor and Lab-Assistant for each course
export const generateRolesList = (courseList: Course[]): Role[] => {
  return courseList.flatMap(course => [
    {
      role: "Tutor",
      course,
      description: "",
      expressionOfInterest: "",
      note: "",
      status: "",
    },
    {
      role: "Lab-Assistant",
      course,
      description: "",
      expressionOfInterest: "",
      note: "",
      status: "",
    },
  ]);
};