import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "graphql-ws";
import { tutorApi } from "@/services/tutor.api";

interface TutorUnavailableData {
  tutorUnavailable: {
    id: string;
    name: string;
    email: string;
  }
}
// Create WebSocket client
const wsClient = createClient({
  url: "ws://localhost:3001/graphql",
});

// Interfacae type for TutorsUnavailableContext
interface TutorsUnavailableContextType {
  tutorsUnavailable: any[];
  setTutorsUnavailable: (tutorsUnavailable: any[]) => void;
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

  const [tutorsUnavailable, setTutorsUnavailable] = useState<any[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      const tutors = await tutorApi.getAllTutors();
      setTutorsUnavailable(tutors.filter((tutor: any) => tutor.blocked === true).map((tutor: any) => ({
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
          setTutorsUnavailable(prev => {
            if (prev.some(tutor => tutor.id === data?.data?.tutorUnavailable.id)) {
              return prev;
            }
            return [...prev, data?.data?.tutorUnavailable];
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

