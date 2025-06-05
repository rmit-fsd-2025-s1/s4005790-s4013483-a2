import { useEffect, useState } from "react";
import {
  Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, VStack, Alert, AlertIcon,
  Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Spinner
} from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "@/context/UserContext";
import { lecturerApi } from "@/services/lecturer.api";
import { tutorApi, TutorProfile, Tutor } from "@/services/tutor.api";

export default function LecturerAnalytics() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // For modal/profile
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Tutor mapping: email -> name
  const [tutorEmailToName, setTutorEmailToName] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch analytics and tutor name mapping in parallel
    setLoading(true);
    Promise.all([
      lecturerApi.getAnalytics(1),
      tutorApi.getAllTutors()
    ])
    .then(([analyticsData, tutors]) => {
      setAnalytics(analyticsData);
      // Map emails to names for lookup
      const emailToName: Record<string, string> = {};
      tutors.forEach((t: Tutor) => { emailToName[t.email] = t.name; });
      setTutorEmailToName(emailToName);
    })
    .finally(() => setLoading(false));
  }, []);

  // Fetch tutor profile when email changes
  useEffect(() => {
    if (!selectedEmail) return;
    setProfileLoading(true);
    tutorApi.getTutorProfileByEmail(selectedEmail)
      .then(profile => setTutorProfile(profile))
      .catch(() => setTutorProfile(null))
      .finally(() => setProfileLoading(false));
  }, [selectedEmail]);

  // Helper: render tutor's name as clickable link
  function NameLink({ email }: { email: string }) {
    const name = tutorEmailToName[email] || email;
    return (
      <Link color="blue.600" onClick={() => { setSelectedEmail(email); onOpen(); }} cursor="pointer">
        {name}
      </Link>
    );
  }

  // Helper: render profile modal
  function TutorProfileModal() {
    return (
      <Modal isOpen={isOpen} onClose={() => { setSelectedEmail(null); onClose(); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tutor Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {profileLoading ? <Spinner /> : tutorProfile ? (
              <Box>
                <Text><b>Name:</b> {tutorEmailToName[tutorProfile.email] || tutorProfile.email}</Text>
                <Text><b>Email:</b> {tutorProfile.email}</Text>
                <Text><b>Roles:</b> {tutorProfile.roles}</Text>
                <Text><b>Availability:</b> {tutorProfile.availability}</Text>
                <Text><b>Skills:</b> {Array.isArray(tutorProfile.skills) ? tutorProfile.skills.join(", ") : ""}</Text>
                <Text><b>Credentials:</b>
                  <ul>
                    {tutorProfile.credentials && Object.entries(tutorProfile.credentials).map(([k, v]) =>
                      <li key={k}>{k}: {v}</li>
                    )}
                  </ul>
                </Text>
                <Text><b>Profile Created:</b> {tutorProfile.createdAt ? new Date(tutorProfile.createdAt).toLocaleString() : "-"}</Text>
                <Text><b>Profile Updated:</b> {tutorProfile.updatedAt ? new Date(tutorProfile.updatedAt).toLocaleString() : "-"}</Text>
              </Box>
            ) : (
              <Text>No profile found for this tutor.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (loading) return <Box><Header /><Box p={8}><Text>Loading analytics...</Text></Box><Footer /></Box>;
  if (!analytics) return <Box><Header /><Box p={8}><Text>No analytics data available.</Text></Box><Footer /></Box>;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={8}>
        <Heading as="h1" mb={8} color="#032e5b" textAlign="center">
          Lecturer Analytics
        </Heading>
        <VStack spacing={8} align="stretch">
          {/* Most Chosen Applicant */}
          <Box>
            <Heading as="h2" size="md" mb={2} color="teal.600">Most Approved Applicant</Heading>
            {analytics.most && analytics.most.count > 0 ? (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text><b>Name:</b> <NameLink email={analytics.most.email} /></Text>
                  <Text><b>Email:</b> {analytics.most.email}</Text>
                  <Text><b>Number of Approved Applications:</b> {analytics.most.count}</Text>
                  {analytics.most.lastApprovedApp && (
                    <>
                      <Text><b>Last Approved Role:</b> {analytics.most.lastApprovedApp.roles}</Text>
                      <Text><b>Course:</b> {analytics.most.lastApprovedApp.courseName} ({analytics.most.lastApprovedApp.courseCode})</Text>
                    </>
                  )}
                </Box>
              </Alert>
            ) : (
              <Text>No applicant has been approved yet.</Text>
            )}
          </Box>
          {/* Least Chosen Applicant */}
          <Box>
            <Heading as="h2" size="md" mb={2} color="purple.600">Least Approved Applicant</Heading>
            {analytics.least && analytics.least.count > 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text><b>Name:</b> <NameLink email={analytics.least.email} /></Text>
                  <Text><b>Email:</b> {analytics.least.email}</Text>
                  <Text><b>Number of Approved Applications:</b> {analytics.least.count}</Text>
                  {analytics.least.lastApprovedApp && (
                    <>
                      <Text><b>Last Approved Role:</b> {analytics.least.lastApprovedApp.roles}</Text>
                      <Text><b>Course:</b> {analytics.least.lastApprovedApp.courseName} ({analytics.least.lastApprovedApp.courseCode})</Text>
                    </>
                  )}
                </Box>
              </Alert>
            ) : (
              <Text>No applicant has been approved yet.</Text>
            )}
          </Box>
          {/* Applicants Never Approved */}
          <Box>
            <Heading as="h2" size="md" mb={2} color="red.600">Applicants Never Approved</Heading>
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Course</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {analytics.neverSelected.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" color="gray.400">All applicants have been approved at least once.</Td>
                  </Tr>
                ) : (
                  analytics.neverSelected.map((app: any, idx: number) => (
                    <Tr key={app.email + idx}>
                      <Td><NameLink email={app.email} /></Td>
                      <Td>{app.email}</Td>
                      <Td>{app.roles}</Td>
                      <Td>{app.courseName} ({app.courseCode})</Td>
                      <Td>{app.outcome}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
          {/* All Approved Counts */}
          <Box>
            <Heading as="h2" size="md" mb={2} color="blue.600">All Applicants Approved Count</Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Total Approved</Th>
                </Tr>
              </Thead>
              <Tbody>
                {analytics.stats.length === 0 ? (
                  <Tr>
                    <Td colSpan={3} textAlign="center" color="gray.400">No data.</Td>
                  </Tr>
                ) : (
                  analytics.stats.map((row: any, idx: number) => (
                    <Tr key={row.email + idx}>
                      <Td><NameLink email={row.email} /></Td>
                      <Td>{row.email}</Td>
                      <Td>{row.count}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </VStack>
        <TutorProfileModal />
      </Box>
      <Footer />
    </Box>
  );
}