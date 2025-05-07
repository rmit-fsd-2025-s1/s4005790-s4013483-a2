import { lecturerApi } from "@/services/lecturer.api";
import { tutorApi } from "@/services/tutor.api";
import { User } from "@/components/User";

let usersList: Omit<User, "password">[] = [];

async function useAllUsers() {
  const [lecturers, tutors] = await Promise.all([
    lecturerApi.getAllLecturers(),
    tutorApi.getAllTutors(),
  ]);

  const lecturersWithRole : User[] = lecturers.map((l : Omit<User, "password">) => ({ ...l, role: "Lecturer" }));
  const tutorsWithRole : User[] = tutors.map((t : Omit<User, "password">) => ({ ...t, role: "Tutor" }));

  usersList = [...lecturersWithRole, ...tutorsWithRole];
};

await useAllUsers();

export { usersList };
