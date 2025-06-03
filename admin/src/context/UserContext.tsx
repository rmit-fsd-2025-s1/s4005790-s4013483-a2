import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/components/User";
import { adminService } from "@/services/api";
import bcrypt from "bcryptjs";

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
            const admins = await adminService.getAllAdmins();
            const admin = admins.find((admin) => admin.username === userToCheck.username && bcrypt.compare(userToCheck.password, admin.password));

            if (admin) {
                setUser(admin);
            }
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
