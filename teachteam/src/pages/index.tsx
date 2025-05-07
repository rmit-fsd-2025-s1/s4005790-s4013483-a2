import { ChakraProvider, Box } from "@chakra-ui/react";
import Header from "../components/Header";
import DefaultMainContent from "../components/MainContent";
import LecturerMainContent from "@/components/LecturerMainContent";
import TutorMainContent from "@/components/TutorMainContent";
import Footer from "../components/Footer";
import { User } from "@/components/User";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user } = useUser();

  return (
    <ChakraProvider>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box as="main" flex="1">
          <MainContent user={user} />
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

function MainContent({ user } : { user : Omit<User, "password"> | null}) {
  if (user) {
    if (user.role === "Lecturer") {
      return <LecturerMainContent/>;
    }else if (user.role === "Tutor") {
      return <TutorMainContent/>;
    }
  }else {
    return <DefaultMainContent/>;
  };
};
