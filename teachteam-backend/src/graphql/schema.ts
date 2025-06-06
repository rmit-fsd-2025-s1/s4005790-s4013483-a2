import { gql } from "graphql-tag";

export const typeDefs = gql`
    type Admin {
        id: ID!
        username: String!
        password: String!
    }
    type Course {
        code: String!
        name: String!
        skills: [String!]!
        description: String!
    }
    type Lecturer {
        id: ID!
        name: String!
        email: String!
        password: String!
        profile: LecturerProfile!
    }
    type LecturerProfile {
        id: ID!
        age: Int!
        contact: String
        biography: String
        links: String
    }

    type Tutor {
        id: ID!
        name: String!
        email: String!
        password: String!
        blocked: Boolean!
    }

    type Query {
        admins: [Admin!]!
        courses: [Course!]!
        lecturers: [Lecturer!]!
        lecturerProfile: [LecturerProfile!]!
        lecturerProfileCourses(lecturerProfileId: ID!): [Course!]!
        tutors: [Tutor!]!
    }

    type Mutation {
        addCourseToLecturerProfile(courseCodes: [String!]!, lecturerProfileId: ID!): LecturerProfile!
        addCourse(code: String!, name: String!, skills: [String!]!, description: String!): Course!
        updateCourse(code: String!, name: String!, skills: [String!]!, description: String!): Course!
        deleteCourse(code: String!): Boolean!
        changeTutorBlockedStatus(id: ID!, blocked: Boolean!): Tutor!
    }
`;