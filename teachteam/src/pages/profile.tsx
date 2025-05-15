import { Box, ChakraProvider, Checkbox, FormControl, FormLabel, Select, Input, Button, VStack, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { TutorProfile } from "@/services/tutor.api";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { tutorApi } from "@/services/tutor.api";

const skillsList = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "PHP",
  "HTML",
  "CSS",
  "SQL",
  "NoSQL",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Django",
];

const academicCredentialsList = [
  "High school degree",
  "Certificate degree",
  "Diploma degree",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctoral degree",
];

export default function Profiles() {
  const [profilesChange, setProfilesChange] = useState<TutorProfile>({
    roles: "",
    availability: "None",
    skills: [], // Initialize as an empty array
    credentials: {}, // Initialize as an empty object
  });
  const [createdAt, setCreatedAt] = useState<string>("Loading...");
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const profile = await tutorApi.getTutorProfileByEmail(user.email);
          setProfilesChange({
            ...profile,
            skills: profile.skills || [], // Fallback to an empty array
            credentials: profile.credentials || {}, // Fallback to an empty object
          });
          setCreatedAt(new Date(profile.createdAt).toLocaleDateString());
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      try {
        await tutorApi.saveTutorProfile(profilesChange);
        onOpen();
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
  };

  const handleClose = () => {
    onClose();
    router.push("/tutor");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target;

    if (type === "checkbox") {
      if (academicCredentialsList.includes(name)) {
        setProfilesChange((prevProfile) => ({
          ...prevProfile,
          credentials: {
            ...prevProfile.credentials,
            [name]: checked ? "" : undefined,
          },
        }));
      } else {
        setProfilesChange((prevProfile) => ({
          ...prevProfile,
          skills: checked
            ? [...prevProfile.skills, name]
            : prevProfile.skills.filter((skill) => skill !== name),
        }));
      }
    } else {
      setProfilesChange((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>, credential: string) => {
    const { value } = e.target;
    setProfilesChange((prevProfile) => ({
      ...prevProfile,
      credentials: {
        ...prevProfile.credentials,
        [credential]: value,
      },
    }));
  };

  return (
    <ChakraProvider>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box as="main" flex="1" w="100%" p={8} textAlign="center" maxW="800px" mx="auto">
          <VStack>
            <form onSubmit={handleSubmit}>
              <Text textAlign="center" color="#32e5b" style={{ fontWeight: "bold" }}>
                Account Details
              </Text>
              <Text textAlign="left" color="#032e5b">
                Name
              </Text>
              <Text textAlign="left">{user?.name}</Text>
              <Text textAlign="left" color="#032e5b">
                Email
              </Text>
              <Text textAlign="left">{user?.email}</Text>
              <Text textAlign="left" color="#032e5b">
                Created At
              </Text>
              <Text textAlign="left">{createdAt}</Text>
              <FormControl>
                <FormLabel textAlign="center" color="#32e5b" style={{ fontWeight: "bold" }}>
                  Profile
                </FormLabel>
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
                      isChecked={profilesChange.skills?.includes(skill)} // Use optional chaining
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
                        isChecked={profilesChange.credentials?.[credential] !== undefined} // Use optional chaining
                        onChange={handleChange}
                      >
                        {credential}
                      </Checkbox>
                      {profilesChange.credentials?.[credential] !== undefined && (
                        <Input
                          color="#032e5b"
                          name={`${credential}_title`}
                          value={profilesChange.credentials?.[credential] || ""} // Use fallback
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