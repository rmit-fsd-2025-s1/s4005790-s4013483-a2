import { Course, courseList } from "@/components/CoursesList"

export interface Role {
  role: "Tutor/Lab-Assistant";
  course: Course;
  description: string,
  expressionOfInterest: string,
  note: string,
  status: string,
}

export const rolesList: Role[] = courseList.map(course => ({
  role: "Tutor/Lab-Assistant",
  course,
  description: "",
  expressionOfInterest: "",
  note: "",
  status: "",
}));

//export const rolesList : Role[] = [
//  { role: "Tutor", course: courseList[0] },
//  { role: "Lab-assistant", course: courseList[0] },
//  { role: "Tutor", course: courseList[1] },
//  { role: "Lab-assistant", course: courseList[2] },
//  { role: "Tutor", course: courseList[3] },
//  { role: "Lab-assistant", course: courseList[3] },
//  { role: "Tutor", course: courseList[4] },
//  { role: "Lab-assistant", course: courseList[4] },
//];
