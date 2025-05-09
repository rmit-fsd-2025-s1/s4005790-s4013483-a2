import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/components/User";
import { tutorApi } from "@/services/tutor.api";
import { lecturerApi } from "@/services/lecturer.api";

// Interfacae type for UserListContext
interface UsersListsContextType {
  usersList: Omit<User, 'password'>[];
  setUsersList: (usersList: Omit<User, 'password'>[]) => void;
}

// UserContext for context hook to use
const UsersListsContext = createContext<UsersListsContextType>({
  usersList: [],
  setUsersList: () => {},
});

// Context hook for global usage to read/set currently logged in user
export const useUsersLists = () => useContext(UsersListsContext);

// To wrap in _app.tsx
export const UsersListsProvider = ({ children }: { children: ReactNode }) => {

  const [usersList, setUsersList] = useState<Omit<User, 'password'>[]>([]);

  // Load in users list on load.
  useEffect(() => {
    const checkUserList = async () => {
        const [lecturers, tutors] = await Promise.all([
            lecturerApi.getAllLecturers(),
            tutorApi.getAllTutors(),
          ]);
        
          const lecturersWithRole : User[] = lecturers.map((l : Omit<User, "password">) => ({ ...l, role: "Lecturer" }));
          const tutorsWithRole : User[] = tutors.map((t : Omit<User, "password">) => ({ ...t, role: "Tutor" }));
        
          setUsersList([...lecturersWithRole, ...tutorsWithRole]);
    //   const storedUser = localStorage.getItem("user");

    //   if (storedUser && storedUser !== "null") {
    //     const userToCheck : User = JSON.parse(storedUser);
    //     const [tutorResult, lecturerResult] = await Promise.allSettled([
    //       tutorApi.getTutorByEmail(userToCheck.email),
    //       lecturerApi.getLecturerByEmail(userToCheck.email),
    //     ]);

    //     const tutor = tutorResult.status === "fulfilled" ? tutorResult.value : null;
    //     const lecturer = lecturerResult.status === "fulfilled" ? lecturerResult.value : null;
        
    //     const userFound = tutor || lecturer;

    //     setUser({
    //       email: userFound.email,
    //       name: userFound.name,
    //       role: tutor ? "Tutor" : "Lecturer"
    //     });
    //   }
    };
    checkUserList();
  }, []);

  return (
    <UsersListsContext.Provider value={{ usersList, setUsersList }}>
      {children}
    </UsersListsContext.Provider>
  );
};

