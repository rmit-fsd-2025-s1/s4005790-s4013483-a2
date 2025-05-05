import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust this to match your backend URL
});

export interface Lecturer {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const lecturerApi = {
  getAllLecturers: async () => {
    const response = await api.get("/lecturers");
    return response.data;
  },

  getLecturerById: async (id: number) => {
    const response = await api.get(`/lecturers/${id}`);
    return response.data;
  },

  getLecturerByEmail: async (email: string) => {
    const response = await api.get(`/lecturers/${email}`);
    return response.data;
  },

  createLecturer: async (lecturer: Partial<Lecturer>) => {
    const response = await api.post("/lecturers", lecturer);
    return response.data;
  },

  updateLecturer: async (id: number, lecturer: Partial<Lecturer>) => {
    const response = await api.put(`/lecturers/${id}`, lecturer);
    return response.data;
  },

  deleteLecturer: async (id: number) => {
    const response = await api.delete(`/lecturers/${id}`);
    return response.data;
  },
};

