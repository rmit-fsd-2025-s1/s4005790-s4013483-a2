import { gql } from "@apollo/client";
import { client } from "./apollo-client";

// Our typescript interface for a pet
export interface Admin {
  id: string;
  username: string;
  password: string;
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

export const adminService = {
  getAllAdmins: async (): Promise<Admin[]> => {
    const { data } = await client.query({ query: GET_ADMINS });
    return data.admins;
  },
};