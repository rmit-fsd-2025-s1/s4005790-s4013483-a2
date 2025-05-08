import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export interface LecturerProfile {
  id: number;
  age: number;
  contact: string;
  biography: string;
  links: string[];
}

export const lecturerProfileApi = {
  getAllProfiles: async () => {
    const response = await api.get("/lecturerProfiles");
    return response.data;
  },

  getProfileById: async (id: number) => {
    const response = await api.get(`/lecturerProfiles/${id}`);
    return response.data;
  },

  createProfile: async (profile: Partial<LecturerProfile>) => {
    const response = await api.post("/lecturerProfiles", profile);
    return response.data;
  },

  updateProfile: async (id: number, profile: Partial<LecturerProfile>) => {
    const response = await api.put(`/lecturerProfiles/${id}`, profile);
    return response.data;
  },

  deleteProfile: async (id: number) => {
    const response = await api.delete(`/lecturerProfiles/${id}`);
    return response.data;
  },

  getLecturerByProfile: async (profileId: number) => {
    const response = await api.get(`/lecturerProfiles/${profileId}/lecturers`);
    return response.data;
  },

  createLecturerWithProfile: async (profileId: number, lecturer: { name: string; email: string; password: string }) => {
    const response = await api.post(`/lecturerProfiles/${profileId}/lecturers`, lecturer);
    return response.data;
  },

  deleteLecturerFromProfile: async (profileId: number, lecturerId: number) => {
    const response = await api.delete(`/lecturerProfiles/${profileId}/lecturers/${lecturerId}`);
    return response.data;
  },
}; 