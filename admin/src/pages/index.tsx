import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LecturerCourses from "@/components/LecturerCourses";
import { Box, Divider } from "@chakra-ui/react";
import EditCourses from "@/components/EditCourses";
import BlockTutor from "@/components/BlockTutor";
import router from "next/router";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Header />
      <Box w="100%" maxW="800px" mx="auto" px={4}>
      <LecturerCourses />
      <Divider borderColor="black" my={4} borderWidth="1px" />
      <EditCourses />
      <Divider borderColor="black" my={4} borderWidth="1px" />
      <BlockTutor />
      </Box>
      <Footer />
    </>
  );
}