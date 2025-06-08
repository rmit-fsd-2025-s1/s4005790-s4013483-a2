import { gql } from "graphql-tag";
import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

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
    type Application {
        id: ID!
        roles: String!
        courseCode: String!
        courseName: String!
        outcome: String!
        expressionOfInterest: String!
        note: String!
        email: String!
        courseSkills: [String]
        tutorSkills: [String]
        skillsFulfilled: String!
    }

    type Query {
        admins: [Admin!]!
        courses: [Course!]!
        lecturers: [Lecturer!]!
        lecturerProfile: [LecturerProfile!]!
        lecturerProfileCourses(lecturerProfileId: ID!): [Course!]!
        tutors: [Tutor!]!
        applications: [Application!]!
    }

    type Mutation {
        addCourseToLecturerProfile(courseCodes: [String!]!, lecturerProfileId: ID!): LecturerProfile!
        addCourse(code: String!, name: String!, skills: [String!]!, description: String!): Course!
        updateCourse(code: String!, name: String!, skills: [String!]!, description: String!): Course!
        deleteCourse(code: String!): Boolean!
        updateTutorBlocked(id: ID!, blocked: Boolean!): Tutor!
        removeCourseFromLecturerProfiles(courseCode: String!): [LecturerProfile!]!
    }

    type Subscription {
        tutorUnavailable: Tutor!
    }
`;