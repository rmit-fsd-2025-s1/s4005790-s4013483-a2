import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Role } from "@/components/RolesList";

// Interface type for ApplicationsContext
interface ApplicationsContextType {
  applications: Map<string, Role[]>;
  setApplications: (applications: Map<string, Role[]>) => void;
}

// ApplicationsContext for context hook to use
const ApplicationsContext = createContext<ApplicationsContextType>({
  applications: new Map(),
  setApplications: () => {},
});

// Context hook for global usage to read/set existing applications
export const useApplications = () => useContext(ApplicationsContext);

// To wrap in _app.tsx
export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {

  const [applications, setApplications] = useState<Map<string, Role[]>>(new Map());

  // Check if there are stored applications (through localStorage) on load.
  useEffect(() => {
    const storedApplications = localStorage.getItem("applications");

    if (storedApplications && JSON.parse(storedApplications).size !== 0) {
      setApplications(new Map(JSON.parse(storedApplications)));
    }
  }, []);

  // If applications is ever changed, update localStorage.
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(Array.from(applications.entries())));
  }, [applications]);

  return (
    <ApplicationsContext.Provider value={{ applications: applications, setApplications: setApplications }}>
      {children}
    </ApplicationsContext.Provider>
  );
};
