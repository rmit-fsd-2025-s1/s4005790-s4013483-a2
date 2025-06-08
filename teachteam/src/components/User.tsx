export interface User {
  id: number,
  email: string,
  password: string,
  role: "Lecturer" | "Tutor",
  name: string,
};
