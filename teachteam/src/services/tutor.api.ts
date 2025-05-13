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
};