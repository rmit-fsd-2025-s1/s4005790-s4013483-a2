import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/components/User";
import { usersList } from "@/components/UsersList";
import { tutorApi } from "@/services/tutor.api";
import { lecturerApi } from "@/services/lecturer.api";

// Interfacae type for UserContext
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// UserContext for context hook to use
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// Context hook for global usage to read/set currently logged in user
export const useUser = () => useContext(UserContext);

// To wrap in _app.tsx
export const UserProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);

  // Check if user is signed in (through localStorage) on load.
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "null") {
        const userToCheck : User = JSON.parse(storedUser);
        // const userIndex = usersList.findIndex((u: User) => u.email === userToCheck.email && u.password === userToCheck.password);
        const [tutorResult, lecturerResult] = await Promise.allSettled([
          tutorApi.getTutorByEmail(userToCheck.email),
          lecturerApi.getLecturerByEmail(userToCheck.email),
        ]);

        const tutor = tutorResult.status === "fulfilled" ? tutorResult.value : null;
        const lecturer = lecturerResult.status === "fulfilled" ? lecturerResult.value : null;
        
        const userFound = tutor || lecturer;

        setUser({
          email: userFound.email,
          password: userFound.password,
          name: userFound.name,
          role: tutor ? "Tutor" : "Lecturer"
        });
      }
    };
    checkUser();
  }, []);

  // If user is ever changed, update localStorage.
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

