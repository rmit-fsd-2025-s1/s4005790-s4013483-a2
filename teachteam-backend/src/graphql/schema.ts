import { gql } from "graphql-tag";

export const typeDefs = gql`
    type Admin {
        id: ID!
        username: String!
        password: String!
    }

    type Query {
        admins: [Admin!]!
    }

    type Mutation {
        createAdmin(username: String!, password: String!): Admin!
        updateAdmin(id: ID!, username: String!, password: String!): Admin!
        deleteAdmin(id: ID!): Boolean!
    }
`;