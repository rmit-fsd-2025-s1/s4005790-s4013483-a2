import { Box, ChakraProvider, Checkbox, FormControl, FormLabel, Select, Input, Button, VStack, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Profile as Profile } from "@/components/Profile";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { tutorApi } from "@/services/tutor.api";

const skillsList = [
  "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin",
  "PHP", "HTML", "CSS", "SQL", "NoSQL", "React", "Angular", "Vue", "Node.js", "Django"
];

const academicCredentialsList = [
  "High school degree", "Certificate degree", "Diploma degree", "Associate degree", "Bachelor's degree", "Master's degree", "Doctoral degree"
];

export default function Profiles() {
  const [profilesChange, setProfilesChange] = useState<Profile>({
    roles: "",
    availability: "None", // Default value for availability
    skills: "",
    credentials: [] 
  });
  const [createdAt, setCreatedAt] = useState<string>("Loading...");
  const { profiles, setProfiles } = useProfile();
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // If there is a pre-existing profile, load it in.
  useEffect(() => {
    if (user && profiles.has(user.email)) {
      async function fetchCreatedAt() {
        if (user) {
          const value = await tutorApi.getTutorByEmail(user.email);
          // TODO: Format time
          setCreatedAt(value.createdAt);
        }
      }
      fetchCreatedAt();

      const profile = profiles.get(user.email);
      if (profile) {
        setProfilesChange(profile);
      }
    }
  }, [profiles, user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfiles((prevProfiles) => {
      const newProfiles = new Map(prevProfiles);
      newProfiles.set(user.email, profilesChange);
      return newProfiles;
    });
    onOpen();
  }

  const handleClose = () => {
    onClose();
    router.push("/tutor");
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, type, value, checked } = e.target;
    const returnVal: string | boolean = type === "checkbox" ? checked : value;

    if (type === "checkbox") {
      if (academicCredentialsList.includes(name)) {
        setProfilesChange((prevProfile) => ({
          ...prevProfile,
          credentials: {
            ...prevProfile.credentials,
            [name]: checked ? "" : undefined
          }
        }));
      } else {
        setProfilesChange((prevProfile) => ({
          ...prevProfile,
          skills: checked
            ? prevProfile.skills
              ? `${prevProfile.skills}, ${name}`
              : name
            : prevProfile.skills
                .split(", ")
                .filter((skill) => skill !== name)
                .join(", ")
        }));
      }
    } else {
      setProfilesChange((prevProfile) => ({
        ...prevProfile,
        [name]: returnVal
      }));
    }
  }

  function handleCredentialChange(e: React.ChangeEvent<HTMLInputElement>, credential: string) {
    const { value } = e.target;
    setProfilesChange((prevProfile) => ({
      ...prevProfile,
      credentials: {
        ...prevProfile.credentials,
        [credential]: value
      }
    }));
  }

  return (
    <ChakraProvider>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box as="main" flex="1" w="100%" p={8} textAlign="center" maxW="800px" mx="auto">
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
                <FormLabel textAlign="center" color="#32e5b" style={{fontWeight:"bold"}}>Profile</FormLabel>
                <FormLabel color="#032e5b">Previous Roles</FormLabel>
                <Input name="roles" value={profilesChange.roles} onChange={handleChange} />
                <FormLabel color="#032e5b">Availability</FormLabel>
                <Select
                  name="availability"
                  value={profilesChange.availability}
                  onChange={handleChange}
                >
                  <option value="None">None</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Full-time">Full-time</option>
                </Select>
                <FormLabel color="#032e5b">Skills</FormLabel>
                <HStack wrap="wrap" spacing={4}>
                  {skillsList.map((skill) => (
                    <Checkbox 
                      color="#032e5b"
                      key={skill}
                      name={skill}
                      isChecked={profilesChange.skills.includes(skill)}
                      onChange={handleChange}
                    >
                      {skill}
                    </Checkbox>
                  ))}
                </HStack>
                <FormLabel color="#032e5b">Academic Credentials</FormLabel>
                <VStack align="start">
                  {academicCredentialsList.map((credential) => (
                    <HStack key={credential}>
                      <Checkbox
                        color="#032e5b"
                        name={credential}
                        isChecked={profilesChange.credentials[credential] !== undefined}
                        onChange={handleChange}
                      >
                        {credential}
                      </Checkbox>
                      {profilesChange.credentials[credential] !== undefined && (
                        <Input
                          color="#032e5b" 
                          name={`${credential}_title`}
                          value={profilesChange.credentials[credential]}
                          onChange={(e) => handleCredentialChange(e, credential)}
                          placeholder="Degree Title e.g. Bachelor of IT"
                        />
                      )}
                    </HStack>
                  ))}
                </VStack>
              </FormControl>
              <Button type="submit" mt={4}>
                Confirm
              </Button>
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
              <Button colorScheme="blue" onClick={handleClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}
