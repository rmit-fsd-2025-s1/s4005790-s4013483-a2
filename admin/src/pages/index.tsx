import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LecturerCourses from "@/components/LecturerCourses";
import { Divider } from "@chakra-ui/react";
import EditCourses from "@/components/EditCourses";

export default function Home() {
  return (
    <>
      <Header />
      <LecturerCourses />
      <Divider my={4} />
      <EditCourses />
      <Footer />
    </>
  );
}