import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ProfileTutor } from "@/components/Profile";

// Interfacae type for ProfileContext
interface ProfileContextType {
  profiles: Map<string, ProfileTutor>;
  setProfiles: (profiles: Map<string, ProfileTutor>) => void;
}

// ProfileContext for context hook to use
const ProfileContext = createContext<ProfileContextType>({
  profiles: new Map(),
  setProfiles: () => {},
});

// Context hook for global usage to read/set currently logged in user's profile
export const useProfile = () => useContext(ProfileContext);

// To wrap in _app.tsx
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Map<string, ProfileTutor>>(new Map());

  // Check if user is signed in (through localStorage) on load.
  useEffect(() => {
    const storedProfiles = localStorage.getItem("profiles");

    if (storedProfiles && JSON.parse(storedProfiles).size !== 0) {
      setProfiles(new Map(JSON.parse(storedProfiles)));
    }
  }, []);

  // If profile is ever changed, update localStorage.
  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(Array.from(profiles.entries())));
  }, [profiles]);

  return (
    <ProfileContext.Provider value={{ profiles: profiles, setProfiles: setProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
};


