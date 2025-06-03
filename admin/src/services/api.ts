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

const ADD_COURSE_TO_LECTURER = gql`
  mutation AddCourseToLecturer($courseCodes: [String!]!, $lecturerId: ID!) {
    addCourseToLecturer(courseCodes: $courseCodes, lecturerId: $lecturerId) {
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
};

export const lecturerService = {
  getAllLecturers: async (): Promise<Lecturer[]> => {
    const { data } = await client.query({ query: GET_LECTURERS });
    return data.lecturers;
  },
  addCourseToLecturer: async (courseCodes: string[], lecturerId: string): Promise<LecturerProfile> => {
    const { data } = await client.mutate({ mutation: ADD_COURSE_TO_LECTURER, variables: { courseCodes, lecturerId } });
    return data.addCourseToLecturer;
  },
};

export const lecturerProfileService = {
  getLecturerProfileCourses: async (lecturerProfileId: string): Promise<Course[]> => {
    const { data } = await client.query({ query: GET_LECTURER_PROFILE_COURSES, variables: { lecturerProfileId } });
    return data.lecturerProfileCourses;
  },
};