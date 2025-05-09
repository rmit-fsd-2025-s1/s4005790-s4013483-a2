import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/components/User";
import { tutorApi } from "@/services/tutor.api";
import { lecturerApi } from "@/services/lecturer.api";

// Interfacae type for UserContext
interface UserContextType {
  user: Omit<User, 'password'> | null;
  setUser: (user: Omit<User, 'password'> | null) => void;
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

  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

  // Check if user is signed in (through localStorage) on load.
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "null") {
        const userToCheck : User = JSON.parse(storedUser);
        const [tutorResult, lecturerResult] = await Promise.allSettled([
          tutorApi.getTutorByEmail(userToCheck.email),
          lecturerApi.getLecturerByEmail(userToCheck.email),
        ]);

        const tutor = tutorResult.status === "fulfilled" ? tutorResult.value : null;
        const lecturer = lecturerResult.status === "fulfilled" ? lecturerResult.value : null;
        
        const userFound = tutor || lecturer;

        setUser({
          email: userFound.email,
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

