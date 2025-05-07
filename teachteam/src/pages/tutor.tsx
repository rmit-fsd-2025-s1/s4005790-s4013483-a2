import { Box, Heading, Text, Button, Menu, MenuList, MenuItemOption, MenuButton, MenuOptionGroup, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Course, courseList } from "@/components/CoursesList";
import { Role, rolesList } from "@/components/RolesList";
import { useUser } from "@/context/UserContext";
import { useApplications } from "@/context/ApplicationsContext";
import { useProfile } from "@/context/TutorProfileContext";
import { useState, useEffect } from "react";

export default function Tutor() {
  const { user } = useUser();
  const { profiles } = useProfile();
  const [ selectedCourses, setSelectedCourses ] = useState<Course[]>([]);
  const { applications, setApplications } = useApplications();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [expressionOfInterest, setExpressionOfInterest] = useState("");
  const [note, setNote] = useState("");
  const profile = profiles.get(user?.email);

  const handleSelect = (values: string[] | string) => {
    setSelectedCourses(values.map(code => courseList.find(course => course.code === code)));
  };

  const showRoles = () => {
    return rolesList
      .filter((role) => selectedCourses.some((course) => course === role.course) && (user && (!applications.get(user.email) || !applications.get(user.email).some((existingRole : Role)=> existingRole.course.code === role.course.code && existingRole.role === role.role)))).map((role) => (
      <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg" key={role.course.code + role.role}>
        <Text fontWeight="bold" mt={4} color="#032e5b">Required Skills:</Text>
        <Text color="#032e5b">{role.course.skills.join(", ")}</Text>
        <Heading as="h2" size="md" mt={4} color="#032e5b">Role: {role.role}</Heading>
        <Text color="#032e5b">
          <span style={{ fontWeight: "bold" }}>Course: </span>
          {role.course.name} <span>({role.course.code})</span>
        </Text>
        <Text fontWeight="bold" mt={4} color="#032e5b">About Role:</Text>
        <Text color="#032e5b">The tutor will assist in teaching courses, grading assignments, and providing support to students.</Text>
        <Button onClick={() => openApplicationModal(role)} mt={4} color="#032e5b">Apply Now</Button>
      </Box>
    ));
  }

  const openApplicationModal = (role: Role) => {
    setSelectedRole(role);
    onOpen();
  };

  const enrol = () => {
    if (selectedRole) {
      const newRole = { ...selectedRole, expressionOfInterest, note };
      setApplications((prevApplications) => {
        const newApplications = new Map(prevApplications || []);
        if (user && newApplications.has(user.email)) {
          if (!newApplications.get(user.email).some(
            (existingRole: Role) => existingRole.course.code === newRole.course.code && existingRole.role === newRole.role)) {
            newApplications.set(user.email, [...newApplications.get(user.email), (newRole)]);
          }
        } else {
          newApplications.set(user.email, [newRole]);
        }
        return newApplications;
      });
      onClose();
      onConfirmOpen();
    }
  };

  useEffect(() => {
  }, [applications]);

  const userSkills = profile?.skills.split(", ") || [];

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={8} textAlign="center">
        <Heading as="h1" mb={8} color="#032e5b">
          Tutor Home Page
        </Heading>
        <Text color="#032e5b">Welcome, {user?.name}!</Text>
        {selectedCourses.map(course => (
          <Box key={course.code} textAlign="left" p={4} borderWidth="1px" borderRadius="lg" mt={4}>
            <Heading as="h2" size="md" color="#032e5b">{course.name} ({course.code})</Heading>
            <Text fontWeight="bold" mt={4} color="#032e5b">Course Description:</Text>
            <Text color="#032e5b">{course.description}</Text>
            <Text fontWeight="bold" mt={4} color="#032e5b">Required Skills:</Text>
            <Text color="#032e5b">{course.skills.join(", ")}</Text>
          </Box>
        ))}
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} mt={4} color="#032e5b">Select Courses</MenuButton>
          <MenuList>
            <MenuOptionGroup
              type="checkbox"
              value={selectedCourses.map(course => course.code)}
              onChange={handleSelect}
            >
              {selectCoursesList()}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        {showRoles()}
      </Box>
      <Footer />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="#032e5b">Apply for Tutor Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRole && (
              <>
                <Text fontWeight="bold" color="#032e5b">Your skills:</Text>
                <Text color="#032e5b">{userSkills.filter(skill => selectedRole.course.skills.includes(skill)).join(", ")}</Text>
                <Text fontWeight="bold" mt={4} color="#032e5b">Required Skills:</Text>
                <Text color="#032e5b">{selectedRole.course.skills.join(", ")}</Text>
                <FormControl mt={4}>
                  <FormLabel color="#032e5b">Expression of Interest</FormLabel>
                  <Textarea color="#032e5b" value={expressionOfInterest} onChange={(e) => setExpressionOfInterest(e.target.value)} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel color="#032e5b">Note</FormLabel>
                  <Textarea color="#032e5b" value={note} onChange={(e) => setNote(e.target.value)} />
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={enrol}>Submit</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="#032e5b">Application Submitted</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="#032e5b">Your application has been successfully submitted!</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onConfirmClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const selectCoursesList = () => {
  return courseList.map((course) => (
    <MenuItemOption value={course.code} key={course.code}>{course.name}</MenuItemOption>
  ));
};
