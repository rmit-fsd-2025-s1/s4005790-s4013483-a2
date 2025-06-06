import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LecturerCourses from "@/components/LecturerCourses";
import { Divider } from "@chakra-ui/react";
import EditCourses from "@/components/EditCourses";
import BlockTutor from "@/components/BlockTutor";
import { useUser } from "@/context/UserContext";
import router from "next/router";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Header />
      <LecturerCourses />
      <Divider my={4} />
      <EditCourses />
      <Divider my={4} />
      <BlockTutor />
      <Footer />
    </>
  );
}