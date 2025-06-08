import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "graphql-ws";
import { Tutor, tutorApi } from "@/services/tutor.api";

interface TutorUnavailableData {
  tutorUnavailable: TutorUnavailable;
}

interface TutorUnavailable {
  id: string;
  name: string;
  email: string;
}

// Create WebSocket client
const wsClient = createClient({
  url: "ws://localhost:3001/graphql",
});

// Interfacae type for TutorsUnavailableContext
interface TutorsUnavailableContextType {
  tutorsUnavailable: TutorUnavailable[];
  setTutorsUnavailable: (tutorsUnavailable: TutorUnavailable[]) => void;
}

// TutorsUnavailableContext for context hook to use
const TutorsUnavailableContext = createContext<TutorsUnavailableContextType>({
  tutorsUnavailable: [],
  setTutorsUnavailable: () => {},
});

// Context hook for global usage to read/set tutors unavailable
export const useTutorsUnavailable = () => useContext(TutorsUnavailableContext);

// To wrap in _app.tsx
export const TutorsUnavailableProvider = ({ children }: { children: ReactNode }) => {

  const [tutorsUnavailable, setTutorsUnavailable] = useState<TutorUnavailable[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      const tutors = await tutorApi.getAllTutors();
      setTutorsUnavailable(tutors.filter((tutor: Tutor) => tutor.blocked === true).map((tutor: Tutor) => ({
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
      })));
    }
    fetchTutors();
    
    let isSubscribed = true;
    
    const unsubscribe = wsClient.subscribe<TutorUnavailableData>({
      query: `
        subscription TutorUnavailable {
          tutorUnavailable {
            id
            name
            email
          }
        }
      `,
    },
    {
      next: (data) => {
        if (!isSubscribed) return;
        if (data?.data?.tutorUnavailable) {
          const tutor = data.data.tutorUnavailable;
          if (!tutor) return;
          setTutorsUnavailable((prev: TutorUnavailable[]) => {
            if (prev.some(t => t.id === tutor.id)) {
              return prev;
            }
            return [...prev, tutor];
          });
        }
      },
      error: (error: Error) => console.error("Subscription error:", error),
      complete: () => console.log("Subscription completed"),
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  return (
    <TutorsUnavailableContext.Provider value={{ tutorsUnavailable, setTutorsUnavailable }}>
      {children}
    </TutorsUnavailableContext.Provider>
  );
};

