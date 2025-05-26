import { Box, Heading, Text, Flex, VStack, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Link, useDisclosure, Select, Input, Textarea } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SubjectTable from "../components/SubjectTable";
import { useUser } from "@/context/UserContext";
import { useProfile } from "@/context/LecturerProfileContext";
import { fetchCourses, Course } from "@/components/CoursesList";
import { useUsersLists } from "@/context/UsersListsContext";
import { useState, useEffect } from "react";
import { lecturerApi, Application as LecturerApplication } from "@/services/lecturer.api";
import { tutorApi } from "@/services/tutor.api";

export default function Lecturer() {
  const { user } = useUser();
  const { profiles } = useProfile();
  const { usersList } = useUsersLists();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedCourse] = useState("All");
  const [searchQuery, setSearchQuery] = useState({ courseName: "", tutorName: "", availability: "", skill: "" });
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [sortOption, setSortOption] = useState("");
  const [comments, setComments] = useState<Map<string, any[]>>(new Map());
  const [newComment, setNewComment] = useState("");
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [allApplications, setAllApplications] = useState<LecturerApplication[]>([]);
  const [tutorProfiles, setTutorProfiles] = useState<Map<string, any>>(new Map());

  // Fetch all applications for all tutors from backend - use lecturerApi, not tutorApi
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

  // Load comments and courses
  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) setComments(new Map(JSON.parse(storedComments)));
    fetchCourses().then(setCourseList);
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(Array.from(comments.entries())));
  }, [comments]);

  // Process applications for display
  const getTutorApplications = () => {
    return allApplications
      .filter(app => app.outcome !== "Approved")
      .map(app => {
        const userObj = usersList.find(u => u.email === app.email);
        const profile = tutorProfiles.get(app.email); // Use full fetched profile for availability
        const course = courseList.find(c => c.code === app.courseCode);
        // Robustly parse skills as array
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
        return {
          email: app.email,
          name: userObj?.name || "Unknown",
          courseName: app.courseName || course?.name || "Unknown",
          courseCode: app.courseCode,
          skillsFulfilled: app.skillsFulfilled || `${fulfilledSkills}/${requiredSkills.length}`,
          expressionOfInterest: app.expressionOfInterest,
          note: app.note,
          requiredSkills: requiredSkills.join(", "),
          tutorSkills: tutorSkills.join(", "),
          availability: profile?.availability || "Unknown",
          profile
        };
      });
  };

  const tutorApplications = getTutorApplications();

  // Filter applications by selected course
  const filteredApplications = searchResults || (selectedCourse === "All"
    ? tutorApplications
    : tutorApplications.filter(application => application.courseCode === selectedCourse));

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortOption === "courseName") {
      return a.courseName.localeCompare(b.courseName);
    } else if (sortOption === "availability") {
      return a.availability.localeCompare(b.availability);
    }
    return 0;
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
    } catch (err) {
      // If not found, use whatever we have (may be blank)
    }
    const userObj = usersList.find(user => user.email === email);
    setSelectedProfile({ ...profile, name: userObj?.name || "Unknown", email });
    onProfileOpen();
  };

  const handleApproveApplication = () => {
    if (selectedApplication) {
      setAllApplications(prev =>
        prev.map(app =>
          app.email === selectedApplication.email && app.courseCode === selectedApplication.courseCode
            ? { ...app, outcome: "Approved" }
            : app
        )
      );
      setSelectedApplication(null);
      onClose();
    }
  };

  const handleRejectApplication = () => {
    if (selectedApplication) {
      setAllApplications(prev =>
        prev.filter(app =>
          !(app.email === selectedApplication.email && app.courseCode === selectedApplication.courseCode)
        )
      );
      setSelectedApplication(null);
      onClose();
    }
  };

  const handleSearch = () => {
    const results = tutorApplications.filter((application) => {
      const matchesCourseName = searchQuery.courseName === "" || application.courseName.toLowerCase().includes(searchQuery.courseName.toLowerCase());
      const matchesTutorName = searchQuery.tutorName === "" || application.name.toLowerCase().includes(searchQuery.tutorName.toLowerCase());
      const matchesAvailability = searchQuery.availability === "" || application.availability === searchQuery.availability;
      const matchesSkill = searchQuery.skill === "" || application.tutorSkills.toLowerCase().includes(searchQuery.skill.toLowerCase());
      return matchesCourseName && matchesTutorName && matchesAvailability && matchesSkill;
    });
    setSearchResults(results);
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

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={8} textAlign="center">
        <Heading as="h1" mb={8} color="#032e5b">
          Lecturer Home Page
        </Heading>
        <Text color="#032e5b">Welcome, {user?.name} the Lecturer!</Text>
        {/* Search and Sort Options */}
        <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
          <VStack spacing={4}>
            <HStack w="100%" spacing={4}>
              <Input
                placeholder="Search by Course Name"
                value={searchQuery.courseName}
                onChange={(e) => setSearchQuery({ ...searchQuery, courseName: e.target.value })}
              />
              <Input
                placeholder="Search by Tutor Name"
                value={searchQuery.tutorName}
                onChange={(e) => setSearchQuery({ ...searchQuery, tutorName: e.target.value })}
              />
            </HStack>
            <HStack w="100%" spacing={4} color="#032e5b">
              <Select
                placeholder="Select Availability"
                value={searchQuery.availability}
                onChange={(e) => setSearchQuery({ ...searchQuery, availability: e.target.value })}
              >
                <option value="None">None</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
              </Select>
              <Input
                placeholder="Search by Skill"
                value={searchQuery.skill}
                onChange={(e) => setSearchQuery({ ...searchQuery, skill: e.target.value })}
              />
            </HStack>
            <HStack w="100%" spacing={4} color="#032e5b">
              <Select
                placeholder="Sort By"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="courseName">Course Name</option>
                <option value="availability">Availability</option>
              </Select>
              <Button colorScheme="teal" onClick={handleSearch}>
                Search
              </Button>
            </HStack>
          </VStack>
        </Box>
        {/* Applications */}
        <Flex mt={8} justifyContent="space-between">
          <Box w="65%">
            <Heading as="h2" size="lg" mb={4} color="#032e5b">
              Tutor Applications
            </Heading>
            <VStack spacing={4} align="stretch">
              {sortedApplications.map((application, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                  <HStack justifyContent="space-between">
                    <Link onClick={() => handleViewProfile(application.email)} color="teal.500">
                      <Text><strong>Name:</strong> {application.name}</Text>
                    </Link>
                    <Text color="#032e5b"><strong>Course:</strong> {application.courseName}</Text>
                    <Text color="#032e5b"><strong>Availability:</strong> {application.availability}</Text>
                    <Text color="#032e5b"><strong>Skills fulfilled:</strong> {application.skillsFulfilled}</Text>
                    <Button onClick={() => handleViewApplication(application)}>View Details</Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box w="30%">
            <SubjectTable />
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