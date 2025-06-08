import { Box, ChakraProvider, FormControl, FormLabel, Input, Button, VStack, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, NumberInput, NumberInputField } from "@chakra-ui/react"; import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { lecturerApi } from "@/services/lecturer.api";
import { lecturerProfileApi } from "@/services/lecturerProfile.api";
import { ProfileLecturer as Profile } from "@/components/Profile";

export default function ProfileLecturer() {
  const [profileChange, setProfileChange] = useState<Profile>({
    age: 0,
    contact: "",
    biography: "",
    links: ""
  });

  const [error, setError] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("Loading...");
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser || JSON.parse(localUser).role !== "Lecturer") {
      router.push("/");
    }
  }, [router]);

  // If there is a pre-existing profile load it in.
  useEffect(() => {
    async function fetchCreatedAt() {
      if (user) {
        const value = await lecturerApi.getLecturerByEmail(user.email);
        setCreatedAt(value.createdAt);
        setProfileChange(value.profile);
      }
    }
    fetchCreatedAt();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = await validateForm();
    setError(validationError);
    
    if (validationError === "") {
      if (user) {
        const value = await lecturerApi.getLecturerByEmail(user.email);
        
        const updatedProfile = {
          ...value.profile,
          ...profileChange,
        };

        console.log('Sending profile update:', updatedProfile);
        await lecturerProfileApi.updateProfile(value.profile.id, updatedProfile);
        onOpen();
      }
    }
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

  function handleNumberChange(value: string) {
    setProfileChange(prev => ({
      ...prev,
      age: Number(value)
    })); }

  async function validateForm() : Promise<string> {
    if (isNaN(profileChange.age)) {
      return "Age must be a number";
    } else if (profileChange.age < 0 || profileChange.age > 120) {
      return "Age must be between 0 and 120";
    }

    if (profileChange.contact.length > 100) {
      return "Contact must be less than 100 characters";
    }

    if (profileChange.biography.length > 1000) {
      return "Biography must be less than 1000 characters";
    }

    if (profileChange.links.length > 1000) {
      return "Links must be less than 1000 characters";
    }

    return "";
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
                <NumberInput name="age" value={profileChange.age} onChange={handleNumberChange}>
                  <NumberInputField/>
                </NumberInput>
                <FormLabel color="#032e5b">Contact</FormLabel>
                <Input name="contact" value={profileChange.contact} onChange={handleChange} />
                <FormLabel color="#032e5b">Biography</FormLabel>
                <Textarea name="biography" value={profileChange.biography} onChange={handleChange} />
                <FormLabel color="#032e5b">Links</FormLabel>
                <Textarea name="links" value={profileChange.links} onChange={handleChange} />
                {error && <Text color="red.500">{error}</Text>}
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
