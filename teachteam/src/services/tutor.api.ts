import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export interface Tutor {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface Application {
  roles: string;
  courseCode: string;
  courseName: string;
  outcome: string;
  expressionOfInterest: string;
  note: string;
  email: string;
  courseSkills: string[];
  tutorSkills: string[];
  skillsFulfilled: string;
}

export interface TutorProfile {
  id?: number;
  roles: string;
  availability: string;
  skills: string[];
  credentials: { [key: string]: string };
}

export const tutorApi = {
  getAllTutors: async () => {
    const response = await api.get("/tutors");
    return response.data;
  },

  getTutorById: async (id: number) => {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  },

  getTutorByEmail: async (email: string) => {
    const response = await api.get(`/tutors/email/${email}`);
    return response.data;
  },

  createTutor: async (tutor: Partial<Tutor>) => {
    const response = await api.post("/tutors", tutor);
    return response.data;
  },

  updateTutor: async (id: number, tutor: Partial<Tutor>) => {
    const response = await api.put(`/tutors/${id}`, tutor);
    return response.data;
  },

  deleteTutor: async (id: number) => {
    const response = await api.delete(`/tutors/${id}`);
    return response.data;
  },

  createApplication: async (application: Application) => {
    const response = await api.post("/applications", application);
    return response.data;
  },

  getAllProfiles: async () => {
    const response = await api.get("/tutor-profiles");
    return response.data;
  },

  getProfileById: async (id: number) => {
    const response = await api.get(`/tutor-profiles/${id}`);
    return response.data;
  },

  getTutorProfileByEmail: async (email: string) => {
    const response = await api.get(`/tutor-profiles?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  createProfile: async (profile: TutorProfile) => {
    const response = await api.post("/tutor-profiles", profile);
    return response.data;
  },

  updateProfile: async (id: number, profile: TutorProfile) => {
    const response = await api.put(`/tutor-profiles/${id}`, profile);
    return response.data;
  },

  saveTutorProfile: async (profile: TutorProfile) => {
    const response = await api.post("/tutor-profiles/upsert", profile);
    return response.data;
  },

  deleteProfile: async (id: number) => {
    const response = await api.delete(`/tutor-profiles/${id}`);
    return response.data;
  },

  getApplicationsByUser: async (email: string) => {
    const response = await api.get(`/applications/email/${email}`);
    return response.data
  },

  deleteApplication: async (id: number) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  getApplicationsByCourse: async (courseCode: string) => {
    const response = await api.get(`/applications/course/${courseCode}`);
    return response.data;
  },
};