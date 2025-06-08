import { Application } from "@/services/tutor.api";

export interface Analytics {
  most: {
    email: string;
    count: number;
    lastApprovedApp: Application;
  };
  least: {
    email: string;
    count: number;
    lastApprovedApp: Application;
  };
  neverSelected: Application[];
  stats: { email: string; roles: string; courseName: string; courseCode: string; outcome: string; count: number; lastApprovedApp: Application }[];
}