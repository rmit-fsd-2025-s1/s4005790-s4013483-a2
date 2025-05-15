import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { TutorProfile } from "@/services/tutor.api";
import { tutorApi } from "@/services/tutor.api";

interface ProfileContextType {
  profiles: Map<string, TutorProfile>;
  setProfiles: (profiles: Map<string, TutorProfile>) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profiles: new Map(),
  setProfiles: () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const TutorProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Map<string, TutorProfile>>(new Map());

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const profilesData: TutorProfile[] = await tutorApi.getAllProfiles();
        const profilesMap: Map<string, TutorProfile> = new Map(
          profilesData.map((profile) => [String(profile.id), profile])
        );
        setProfiles(profilesMap);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    }
    fetchProfiles();
  }, []);

  return (
    <ProfileContext.Provider value={{ profiles, setProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
};