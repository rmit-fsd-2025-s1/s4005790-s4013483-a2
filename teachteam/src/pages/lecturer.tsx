import { Box, Heading, Text, Flex, VStack, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Link, useDisclosure, Textarea } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SubjectTable from "../components/SubjectTable";
import ApplicantsSearchBar from "../components/ApplicantsSearchBar";
import { useUser } from "@/context/UserContext";
import { useProfile } from "@/context/LecturerProfileContext";
import { Course } from "@/components/CoursesList";
import { useUsersLists } from "@/context/UsersListsContext";
import { useState, useEffect } from "react";
import { lecturerApi, Application as LecturerApplication } from "@/services/lecturer.api";
import { tutorApi } from "@/services/tutor.api";

function formatSessionType(raw: string) {
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (lower === "tutor") return "Tutor";
  if (lower === "lab-assistant" || lower === "lab assistant") return "Lab Assistant";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function Lecturer() {
  const { user } = useUser();
  const { profiles } = useProfile();
  const { usersList } = useUsersLists();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchCriteria, setSearchCriteria] = useState({
    courseCode: "",
    tutorName: "",
    sessionType: "",
    availability: "",
    skills: [] as string[],
  });
  const [comments, setComments] = useState<Map<string, any[]>>(new Map());
  const [newComment, setNewComment] = useState("");
  const [allApplications, setAllApplications] = useState<LecturerApplication[]>([]);
  const [tutorProfiles, setTutorProfiles] = useState<Map<string, any>>(new Map());
  const [managedCourses, setManagedCourses] = useState<Course[]>([]);

  // Fetch all applications for all tutors from backend
  useEffect(() => {
    lecturerApi.getAllApplications().then(setAllApplications);
  }, []);

  // Fetch all tutor profiles for accurate availability and other info
  useEffect(() => {
    tutorApi.getAllProfiles().then((profiles: any[]) => {
      const map = new Map();
      profiles.forEach(profile => {
        map.set(profile.email, profile);
      });
      setTutorProfiles(map);
    });
  }, []);

  // Fetch only the courses managed by this lecturer
  useEffect(() => {
    if (user && user.role === "Lecturer") {
      lecturerApi.getCoursesForLecturerByEmail(user.email).then(setManagedCourses);
    }
  }, [user]);

  // Load comments
  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) setComments(new Map(JSON.parse(storedComments)));
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(Array.from(comments.entries())));
  }, [comments]);

  // Process applications for display
  const getTutorApplications = () => {
    return allApplications
      .filter(app => managedCourses.some(c => c.code === app.courseCode))
      .map(app => {
        const userObj = usersList.find(u => u.email === app.email);
        const profile = tutorProfiles.get(app.email);
        const course = managedCourses.find(c => c.code === app.courseCode);
        let tutorSkills: string[] = [];
        if (app.tutorSkills && Array.isArray(app.tutorSkills)) {
          tutorSkills = app.tutorSkills;
        } else if (profile && profile.skills) {
          if (Array.isArray(profile.skills)) tutorSkills = profile.skills;
          else if (typeof profile.skills === "string") {
            try {
              const parsed = JSON.parse(profile.skills);
              if (Array.isArray(parsed)) tutorSkills = parsed;
              else tutorSkills = profile.skills.split(",").map(s => s.trim()).filter(Boolean);
            } catch {
              tutorSkills = profile.skills.split(",").map(s => s.trim()).filter(Boolean);
            }
          }
        }
        const requiredSkills: string[] = app.courseSkills || course?.skills || [];
        const fulfilledSkills = tutorSkills.filter(skill => requiredSkills.includes(skill)).length;
        // FIX: Remove lowercasing, format session type for display
        const sessionType = formatSessionType(app.roles);

        return {
          ...app,
          email: app.email,
          name: userObj?.name || "Unknown",
          courseName: app.courseName || course?.name || "Unknown",
          courseCode: app.courseCode,
          skillsFulfilled: app.skillsFulfilled || `${fulfilledSkills}/${requiredSkills.length}`,
          requiredSkills: requiredSkills.join(", "),
          tutorSkills: tutorSkills.join(", "),
          availability: profile?.availability || "Unknown",
          sessionType,
          profile
        };
      });
  };

  const tutorApplications = getTutorApplications();

  // Filter applications by current search criteria
  const filteredApplications = tutorApplications.filter(application => {
    const matchesCourse = !searchCriteria.courseCode || application.courseCode === searchCriteria.courseCode;
    const matchesName = !searchCriteria.tutorName || application.name.toLowerCase().includes(searchCriteria.tutorName.toLowerCase());
    // Session type: match "Tutor" or "Lab Assistant"
    const matchesSessionType = !searchCriteria.sessionType || (application.sessionType && application.sessionType === searchCriteria.sessionType);
    const matchesAvailability = !searchCriteria.availability || application.availability === searchCriteria.availability;
    // Skills: every selected skill must be present in the applicant's skills
    const matchesSkills = !searchCriteria.skills.length || searchCriteria.skills.every(skill =>
      application.tutorSkills && application.tutorSkills.toLowerCase().includes(skill.toLowerCase())
    );
    return matchesCourse && matchesName && matchesSessionType && matchesAvailability && matchesSkills;
  });

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    onOpen();
  };

  // Fetch tutor profile by email when lecturer clicks name
  const handleViewProfile = async (email: string) => {
    let profile = tutorProfiles.get(email) || profiles.get(email);
    try {
      const fetchedProfile = await tutorApi.getTutorProfileByEmail(email);
      profile = { ...profile, ...fetchedProfile };
    } catch (err) {}
    const userObj = usersList.find(user => user.email === email);
    setSelectedProfile({ ...profile, name: userObj?.name || "Unknown", email });
    onProfileOpen();
  };

  // Approve/Reject logic: update application outcome and refetch applications for latest state
  const handleApproveApplication = async () => {
    if (selectedApplication) {
      await lecturerApi.updateApplicationOutcome(selectedApplication.id, "Approved");
      lecturerApi.getAllApplications().then(setAllApplications);
      setSelectedApplication(null);
      onClose();
    }
  };

  const handleRejectApplication = async () => {
    if (selectedApplication) {
      await lecturerApi.updateApplicationOutcome(selectedApplication.id, "Rejected");
      lecturerApi.getAllApplications().then(setAllApplications);
      setSelectedApplication(null);
      onClose();
    }
  };

  const handlePostComment = () => {
    if (newComment.trim() && selectedProfile?.email) {
      setComments((prevComments) => {
        const updatedComments = new Map(prevComments);
        const tutorComments = updatedComments.get(selectedProfile.email) || [];
        updatedComments.set(selectedProfile.email, [...tutorComments, { author: user.name, text: newComment }]);
        return updatedComments;
      });
      setNewComment("");
    }
  };

  // --- NEW: Refactored layout: search left, tutor apps top, subject table below ---
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={8}>
        <Heading as="h1" mb={8} color="#032e5b" textAlign="center">
          Lecturer Home Page
        </Heading>
        <Text color="#032e5b" textAlign="center" mb={6}>
          Welcome, {user?.name} the Lecturer!
        </Text>
        <Flex mt={8} gap={6} align="flex-start" width="100%">
          {/* Search Column - left, unchanged */}
          <Box w="22%" minW="260px" maxW="320px">
            <Heading as="h2" size="md" mb={4} color="#032e5b" textAlign="center">
              Search Application
            </Heading>
            <ApplicantsSearchBar
              courses={managedCourses}
              onSearch={setSearchCriteria}
            />
          </Box>
          {/* Main Column: Tutor Applications (top), Subject Table (bottom) */}
          <Box flex="1" minW="320px" maxW="900px">
            <Box>
              <Heading as="h2" size="lg" mb={4} color="#032e5b" textAlign="center">
                Tutor Applications
              </Heading>
              <VStack spacing={4} align="stretch" mb={8}>
                {filteredApplications
                  .filter((application) => application.outcome !== "Approved")
                  .map((application, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                      <HStack justifyContent="space-between" flexWrap="wrap">
                        <Link onClick={() => handleViewProfile(application.email)} color="teal.500">
                          <Text><strong>Name:</strong> {application.name}</Text>
                        </Link>
                        <Text color="#032e5b"><strong>Course:</strong> {application.courseName}</Text>
                        <Text color="#032e5b"><strong>Session Type:</strong> {application.sessionType}</Text>
                        <Text color="#032e5b"><strong>Availability:</strong> {application.availability}</Text>
                        <Text color="#032e5b"><strong>Skills fulfilled:</strong> {application.skillsFulfilled}</Text>
                        <Button onClick={() => handleViewApplication(application)}>View Details</Button>
                      </HStack>
                    </Box>
                  ))}
              </VStack>
            </Box>
            <Box mt={4}>
              <SubjectTable courses={managedCourses} applications={allApplications} />
            </Box>
          </Box>
        </Flex>
      </Box>
      <Footer />

      {/* Application Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="#032e5b">Application Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedApplication && (
              <>
                <Text color="#032e5b"><strong>Name:</strong> {selectedApplication.name}</Text>
                <Text color="#032e5b"><strong>Course:</strong> {selectedApplication.courseName}</Text>
                <Text color="#032e5b"><strong>Session Type:</strong> {selectedApplication.sessionType}</Text>
                <Text color="#032e5b"><strong>Code:</strong> {selectedApplication.courseCode}</Text>
                <Text color="#032e5b"><strong>Skills fulfilled:</strong> {selectedApplication.skillsFulfilled}</Text>
                <Text color="#032e5b"><strong>Required Skills:</strong> {selectedApplication.requiredSkills}</Text>
                <Text color="#032e5b"><strong>Tutor Skills:</strong> {selectedApplication.tutorSkills}</Text>
                <Text color="#032e5b"><strong>Expression of Interest:</strong> {selectedApplication.expressionOfInterest}</Text>
                <Text color="#032e5b"><strong>Note:</strong> {selectedApplication.note}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleApproveApplication}>Approve Application</Button>
            <Button colorScheme="red" onClick={handleRejectApplication}>Reject Application</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={onProfileClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tutor Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProfile ? (
              <>
                <Text color="#032e5b"><strong>Name:</strong> {selectedProfile.name}</Text>
                <Text color="#032e5b"><strong>Availability:</strong> {selectedProfile.availability || "-"}</Text>
                <Text color="#032e5b"><strong>Previous Roles:</strong> {selectedProfile.roles || "-"}</Text>
                <Text color="#032e5b"><strong>Skills:</strong> {
                  selectedProfile.skills && Array.isArray(selectedProfile.skills)
                    ? selectedProfile.skills.join(", ")
                    : selectedProfile.skills || "-"
                }</Text>
                <Text color="#032e5b">
                  <strong>Academic Credentials:</strong>{" "}
                  {selectedProfile.credentials && typeof selectedProfile.credentials === "object"
                    ? Object.keys(selectedProfile.credentials)
                        .filter((key) => selectedProfile.credentials[key] !== undefined)
                        .map((key) => `${key} (${selectedProfile.credentials[key]})`)
                        .join(", ") || "-"
                    : "-"}
                </Text>
                <Heading as="h4" size="md" mt={4} color="#032e5b">Comments</Heading>
                <VStack align="start" spacing={2} mt={2}>
                  {(comments.get(selectedProfile.email) || []).map((comment, index) => (
                    <Box key={index} p={2} borderWidth="1px" borderRadius="lg" w="100%">
                      <Text><strong>{comment.author}:</strong> {comment.text}</Text>
                    </Box>
                  ))}
                </VStack>
                <Textarea
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  mt={4}
                />
                <Button colorScheme="teal" size="sm" mt={2} onClick={handlePostComment}>
                  Post Comment
                </Button>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}