import { fetchCourses, Course } from "@/components/CoursesList"; // Import fetchCourses
import { generateRolesList, Role } from "@/components/RolesList"; // Import generateRolesList
import Header from "@/components/Header"; // Import Header component
import Footer from "@/components/Footer"; // Import Footer component
import { useUser } from "@/context/UserContext";
import { useProfile } from "@/context/TutorProfileContext";
import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Menu, MenuList, MenuItemOption, MenuButton, MenuOptionGroup, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Textarea, useDisclosure, useToast, } from "@chakra-ui/react";
import { tutorApi } from "@/services/tutor.api";

export default function Tutor() {
  const { user } = useUser();
  const { profiles } = useProfile();
  const [courseList, setCourseList] = useState<Course[]>([]); // Dynamic course list from backend
  const [rolesList, setRolesList] = useState<Role[]>([]); // Dynamic roles list
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]); // Selected courses
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal disclosure
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [expressionOfInterest, setExpressionOfInterest] = useState("");
  const [note, setNote] = useState("");
  const profile = profiles.get(user?.email);
  const toast = useToast(); // Initialize Chakra UI toast

  // NEW: Store user's applications
  const [userApplications, setUserApplications] = useState<any[]>([]);

  // Fetch courses, roles, and user's applications when the component mounts or user changes
  useEffect(() => {
    const loadCoursesRolesAndApplications = async () => {
      const courses = await fetchCourses(); // Fetch courses from the backend
      setCourseList(courses);
      setRolesList(generateRolesList(courses)); // Generate roles dynamically
      if (user?.email) {
        try {
          const apps = await tutorApi.getApplicationsByUser(user.email);
          setUserApplications(apps);
        } catch (err) {
          setUserApplications([]);
        }
      }
    };
    loadCoursesRolesAndApplications();
  }, [user?.email]);

  const handleSelect = (values: string[] | string) => {
    // Update selected courses based on course codes
    setSelectedCourses(
      (Array.isArray(values) ? values : [values]).map(
        (code) => courseList.find((course) => course.code === code)!
      )
    );
  };

  // Updated to show only course names in the dropdown menu
  const selectCoursesList = () => {
    return courseList.map((course) => (
      <MenuItemOption value={course.code} key={course.code}>
        {course.name}
      </MenuItemOption>
    ));
  };

  // Helper: already applied?
  const hasApplied = (role: Role) =>
    userApplications.some(
      (app) =>
        app.courseCode === role.course.code &&
        app.roles === role.role
    );

  // Show roles (Tutor and Lab-Assistant) for the selected courses,
  // but filter out roles the user has already applied for
  const showRoles = () => {
    return rolesList
      .filter(
        (role) =>
          selectedCourses.some((course) => course.code === role.course.code) &&
          !hasApplied(role)
      )
      .map((role) => (
        <Box
          textAlign="left"
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          key={role.course.code + "-" + role.role}
        >
          <Text fontWeight="bold" mt={4} color="#032e5b">
            Required Skills:
          </Text>
          <Text color="#032e5b">{role.course.skills.join(", ")}</Text>
          <Heading as="h2" size="md" mt={4} color="#032e5b">
            Role: {role.role}
          </Heading>
          <Text color="#032e5b">
            <span style={{ fontWeight: "bold" }}>Course: </span>
            {role.course.name} <span>({role.course.code})</span>
          </Text>
          <Button
            onClick={() => openApplicationModal(role)}
            mt={4}
            color="#032e5b"
          >
            Apply Now
          </Button>
        </Box>
      ));
  };

  const openApplicationModal = (role: Role) => {
    setSelectedRole(role);
    onOpen();
  };

  // On submit: include user email and refresh applications after submit
  const enrol = async () => {
    if (selectedRole) {
      const application = {
        email: user?.email, // include email
        roles: selectedRole.role,
        courseCode: selectedRole.course.code,
        courseName: selectedRole.course.name,
        outcome: "Sent",
        expressionOfInterest,
        note,
      };

      try {
        await tutorApi.createApplication(application); // Submit application to the backend
        // Re-fetch user's applications so UI updates instantly
        if (user?.email) {
          const apps = await tutorApi.getApplicationsByUser(user.email);
          setUserApplications(apps);
        }
        onClose(); // Close modal

        // Show confirmation toast
        toast({
          title: "Application Sent!",
          description: `Your application for the role of ${selectedRole.role} in ${selectedRole.course.name} has been submitted.`,
          status: "success",
          duration: 5000, // Display the toast for 5 seconds
          isClosable: true, // Allow the user to close the toast manually
        });
      } catch (error) {
        console.error("Failed to submit application:", error);

        // Show error toast
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const userSkills = profile?.skills.split(", ") || [];
  const courseSkills = selectedRole?.course.skills || [];
  const skillsFulfilled = userSkills.filter((skill) =>
    courseSkills.includes(skill)
  );

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={8} textAlign="center">
        <Heading as="h1" mb={8} color="#032e5b">
          Tutor Home Page
        </Heading>
        <Text color="#032e5b">Welcome, {user?.name}!</Text>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} mt={4} color="#032e5b">
            Select Courses
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              type="checkbox"
              value={selectedCourses.map((course) => course.code)}
              onChange={handleSelect}
            >
              {selectCoursesList()}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        {showRoles()}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply for Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRole && (
              <>
                <Text>
                  <strong>Course Name:</strong> {selectedRole.course.name}
                </Text>
                <Text>
                  <strong>Role:</strong> {selectedRole.role}
                </Text>
                <Text>
                  <strong>Skills You Have:</strong> {userSkills.join(", ")}
                </Text>
                <Text>
                  <strong>Skills Required:</strong>{" "}
                  {selectedRole.course.skills.join(", ")}
                </Text>
                <Text>
                  <strong>Skills Fulfilled:</strong> {skillsFulfilled.length}/
                  {selectedRole.course.skills.length}
                </Text>
                <FormControl mt={4}>
                  <FormLabel>Expression of Interest</FormLabel>
                  <Textarea
                    value={expressionOfInterest}
                    onChange={(e) => setExpressionOfInterest(e.target.value)}
                    placeholder="Write your expression of interest"
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Note</FormLabel>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add any additional notes"
                  />
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={enrol}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Footer />
    </Box>
  );
}