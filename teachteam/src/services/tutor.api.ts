import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust this to match your backend URL
});

export interface Tutor {
  id: number;
  name: string;
  email: string;
  password: string;
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
    const response = await api.get(`/tutors/${email}`);
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
};

