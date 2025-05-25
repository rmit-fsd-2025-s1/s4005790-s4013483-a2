import { fetchCourses, Course } from "@/components/CoursesList";
import { generateRolesList, Role } from "@/components/RolesList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { useProfile } from "@/context/TutorProfileContext";
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Menu,
  MenuList,
  MenuItemOption,
  MenuButton,
  MenuOptionGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useDisclosure,
  useToast,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { tutorApi } from "@/services/tutor.api";

export default function Tutor() {
  const { user } = useUser();
  const { profiles } = useProfile();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [expressionOfInterest, setExpressionOfInterest] = useState("");
  const [note, setNote] = useState("");
  // Find the profile by email (not ID!)
  const profile = Array.from(profiles.values()).find((p) => p.email === user?.email);

  const toast = useToast();
  const [userApplications, setUserApplications] = useState<any[]>([]);

  useEffect(() => {
    const loadCoursesRolesAndApplications = async () => {
      const courses = await fetchCourses();
      setCourseList(courses);
      setRolesList(generateRolesList(courses));
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
    setSelectedCourses(
      (Array.isArray(values) ? values : [values]).map(
        (code) => courseList.find((course) => course.code === code)!
      )
    );
  };

  const selectCoursesList = () => {
    return courseList.map((course) => (
      <MenuItemOption value={course.code} key={course.code}>
        {course.name}
      </MenuItemOption>
    ));
  };

  const hasApplied = (role: Role) =>
    userApplications.some(
      (app) =>
        app.courseCode === role.course.code &&
        app.roles === role.role
    );

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

  // Always robustly extract skills as array.
  let userSkills: string[] = [];
  if (profile && profile.skills) {
    if (Array.isArray(profile.skills)) {
      userSkills = profile.skills;
    } else if (typeof profile.skills === "string") {
      try {
        const parsed = JSON.parse(profile.skills);
        if (Array.isArray(parsed)) {
          userSkills = parsed;
        } else {
          userSkills = profile.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
        }
      } catch {
        userSkills = profile.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
    }
  }
  // The course skills are always an array
  const courseSkills: string[] = (selectedRole?.course.skills as string[]) || [];
  // Only show skills that are BOTH in userSkills and courseSkills
  const skillsFulfilledArr: string[] = courseSkills.filter(skill =>
    userSkills.includes(skill)
  );
  const skillsFulfilled = `${skillsFulfilledArr.length}/${courseSkills.length}`;

  const enrol = async () => {
    if (selectedRole) {
      // Compose the application object with the new fields
      const application = {
        email: user?.email,
        roles: selectedRole.role,
        courseCode: selectedRole.course.code,
        courseName: selectedRole.course.name,
        outcome: "Sent",
        expressionOfInterest,
        note,
        courseSkills,
        tutorSkills: userSkills,
        skillsFulfilled,
      };

      try {
        await tutorApi.createApplication(application);
        if (user?.email) {
          const apps = await tutorApi.getApplicationsByUser(user.email);
          setUserApplications(apps);
        }
        onClose();
        toast({
          title: "Application Sent!",
          description: `Your application for the role of ${selectedRole.role} in ${selectedRole.course.name} has been submitted.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Failed to submit application:", error);
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
                <Text mt={2}><strong>Skills You Have (relevant to this course):</strong></Text>
                <Wrap mb={1}>
                  {skillsFulfilledArr.length === 0 ? (
                    <Tag size="sm" colorScheme="gray">
                      <TagLabel>None</TagLabel>
                    </Tag>
                  ) : (
                    skillsFulfilledArr.map((skill) => (
                      <WrapItem key={skill}>
                        <Tag size="sm" colorScheme="green">
                          <TagLabel>{skill}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))
                  )}
                </Wrap>
                <Text mt={2}><strong>Skills Required for this course:</strong></Text>
                <Wrap mb={1}>
                  {courseSkills.length === 0 ? (
                    <Tag size="sm" colorScheme="gray">
                      <TagLabel>None specified</TagLabel>
                    </Tag>
                  ) : (
                    courseSkills.map((skill) => (
                      <WrapItem key={skill}>
                        <Tag
                          size="sm"
                          colorScheme={
                            skillsFulfilledArr.includes(skill) ? "green" : "red"
                          }
                        >
                          <TagLabel>{skill}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))
                  )}
                </Wrap>
                <Text>
                  <strong>Skills Fulfilled:</strong>{" "}
                  {skillsFulfilledArr.length}/{courseSkills.length}
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