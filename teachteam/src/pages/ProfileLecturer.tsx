import { Box, ChakraProvider, FormControl, FormLabel, Input, Button, VStack, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { lecturerApi } from "@/services/lecturer.api";

export interface ProfileLecturer {
  age: string,
  contact: string,
  biography: string,
  links: string
};

export default function ProfileLecturer() {
  const [profileChange, setProfileChange] = useState<ProfileLecturer>({
    age: "",
    contact: "",
    biography: "",
    links: ""
  });

  const [createdAt, setCreatedAt] = useState<string>("Loading...");
  const { profiles, setProfiles } = useProfile();
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // If there is a pre-existing profile load it in.
  useEffect(() => {
    if (user) {
      async function fetchCreatedAt() {
        const value = await lecturerApi.getLecturerByEmail(user.email);
        setCreatedAt(value.createdAt);
      }
      fetchCreatedAt();
    }
    if (user && profiles.has(user.email) && profiles) {
      const profile = profiles.get(user.email);
      if (profile) {
        setProfileChange(profile);
      }
    }
  }, [profiles, user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfiles((prevProfiles) => {
      const newProfiles = new Map(prevProfiles);

      newProfiles.set(user.email, profileChange);

      return newProfiles;
    });
    onOpen();
  };

  const handleClose = () => {
    onClose();
    router.push('/lecturer');
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    setProfileChange((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  }

  return (
    <ChakraProvider>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box as="main" flex="1" w="100%" p={8} textAlign="center">
          <VStack>
            <form onSubmit={handleSubmit}>
              <Text textAlign="center" color="#32e5b" style={{fontWeight:"bold"}}>Account Details</Text>
              <Text textAlign="left" color="#032e5b">Name</Text>
              <Text textAlign="left">{user?.name}</Text>
              <Text textAlign="left" color="#032e5b">Email</Text>
              <Text textAlign="left">{user?.email}</Text>
              <Text textAlign="left" color="#032e5b">Created At</Text>
              <Text textAlign="left">{createdAt}</Text>
              <FormControl>
                {/* Uncommenting below causes errors*/}
                {/* <Text textAlign="center" color="#32e5b" style={{fontWeight:"bold"}}>Account Details</Text> */}
                {/* <FormLabel color="#032e5b">Name</FormLabel> */}
                {/* <Input name="name" value={user?.name} readOnly /> */}
                {/* <FormLabel color="#032e5b">Email</FormLabel> */}
                {/* <Input name="email" value={user?.email} readOnly /> */}
                {/* <Text textAlign="left" color="#032e5b">Created At</Text> */}
                {/* <Input name="createdAt" value={createdAt ?? ""} readOnly/> */}
                {/* <Text textAlign="left">{createdAt}</Text> */}
                <Text textAlign="center" color="#32e5b" style={{fontWeight:"bold"}}>Profile</Text>
                <FormLabel color="#032e5b">Age</FormLabel>
                <Input name="age" value={profileChange.age} onChange={handleChange} />
                <FormLabel color="#032e5b">Contact</FormLabel>
                <Input name="contact" value={profileChange.contact} onChange={handleChange} />
                <FormLabel color="#032e5b">Biography</FormLabel>
                <Textarea name="biography" value={profileChange.biography} onChange={handleChange} />
                <FormLabel color="#032e5b">Links</FormLabel>
                <Textarea name="links" value={profileChange.links} onChange={handleChange} />
              </FormControl>
              <Button type="submit" color="#032e5b">Confirm</Button>
            </form>
          </VStack>
        </Box>
        <Footer />
        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="#032e5b">Profile Updated</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text color="#032e5b">Your profile has been successfully updated!</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}
