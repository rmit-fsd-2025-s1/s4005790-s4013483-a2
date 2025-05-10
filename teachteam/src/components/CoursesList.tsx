import axios from "axios";

export interface Course {
  name: string;
  code: string;
  skills: string[];
  description: string;
}

// Fetch courses from the backend
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get("http://localhost:3001/api/courses"); // Replace with actual backend URL
    return response.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
};