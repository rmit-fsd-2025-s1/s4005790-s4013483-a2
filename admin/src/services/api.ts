import { gql } from "@apollo/client";
import { client } from "./apollo-client";

export interface Admin {
  id: string;
  username: string;
  password: string;
}

export interface Course {
  code: string;
  name: string;
  skills?: string[];
  description?: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: LecturerProfile;
}

export interface LecturerProfile {
  id: string;
  age: number;
  contact: string;
  biography: string;
  links: string;
  courses: Course[];
}

// GraphQL Queries
const GET_ADMINS = gql`
  query GetAdmins {
    admins {
      username
      password
    }
  }
`;

const GET_COURSES = gql`
  query GetCourses {
    courses {
      code
      name
      skills
      description
    }
  }
`;

const GET_COURSES_CODE_NAME = gql`
  query GetCoursesCodeName {
    courses {
      code
      name
    }
  }
`;

const GET_LECTURERS = gql`
  query GetLecturers {
    lecturers {
      id
      name
      profile {
        id
      }
    }
  }
`;

const ADD_COURSE_TO_LECTURER_PROFILE = gql`
  mutation AddCourseToLecturerProfile($courseCodes: [String!]!, $lecturerProfileId: ID!) {
    addCourseToLecturerProfile(courseCodes: $courseCodes, lecturerProfileId: $lecturerProfileId) {
      courses {
        code
      }
    }
  }
`;

const GET_LECTURER_PROFILE_COURSES = gql`
  query GetLecturerProfileCourses($lecturerProfileId: ID!) {
    lecturerProfileCourses(lecturerProfileId: $lecturerProfileId) {
      name
      code
    }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($code: String!, $name: String!, $skills: [String!]!, $description: String!) {
    addCourse(code: $code, name: $name, skills: $skills, description: $description) {
      code
    }
  }
`;

const UPDATE_COURSE = gql`
  mutation UpdateCourse($code: String!, $name: String!, $skills: [String!]!, $description: String!) {
    updateCourse(code: $code, name: $name, skills: $skills, description: $description) {
      code
    }
  }
`;

const DELETE_COURSE = gql`
  mutation DeleteCourse($code: String!) {
    deleteCourse(code: $code)
  }
`;

export const adminService = {
  getAllAdmins: async (): Promise<Admin[]> => {
    const { data } = await client.query({ query: GET_ADMINS });
    return data.admins;
  },
};

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    const { data } = await client.query({ query: GET_COURSES });
    return data.courses;
  },
  getAllCoursesCodeName: async (): Promise<Course[]> => {
    const { data } = await client.query({ query: GET_COURSES_CODE_NAME });
    return data.courses;
  },
  addCourse: async (course: Course): Promise<Course> => {
    const { data } = await client.mutate({ mutation: ADD_COURSE, variables: { code: course.code, name: course.name, skills: course.skills, description: course.description } });
    return data.addCourse;
  },
  updateCourse: async (course: Course): Promise<Course> => {
    const { data } = await client.mutate({ mutation: UPDATE_COURSE, variables: { code: course.code, name: course.name, skills: course.skills, description: course.description } });
    return data.updateCourse;
  },
  deleteCourse: async (code: string): Promise<Course> => {
    const { data } = await client.mutate({ mutation: DELETE_COURSE, variables: { code } });
    return data.deleteCourse;
  },
};

export const lecturerService = {
  getAllLecturers: async (): Promise<Lecturer[]> => {
    const { data } = await client.query({ query: GET_LECTURERS });
    return data.lecturers;
  },

};

export const lecturerProfileService = {
  getLecturerProfileCourses: async (lecturerProfileId: string): Promise<Course[]> => {
    const { data } = await client.query({ query: GET_LECTURER_PROFILE_COURSES, variables: { lecturerProfileId } });
    return data.lecturerProfileCourses;
  },
  addCourseToLecturerProfile: async (courseCodes: string[], lecturerProfileId: string): Promise<LecturerProfile> => {
    const { data } = await client.mutate({ mutation: ADD_COURSE_TO_LECTURER_PROFILE, variables: { courseCodes, lecturerProfileId } });
    return data.addCourseToLecturerProfile;
  },
};