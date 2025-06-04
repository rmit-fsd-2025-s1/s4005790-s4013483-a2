import { useEffect, useState } from "react";
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, VStack, Alert, AlertIcon } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "@/context/UserContext";
import { lecturerApi } from "@/services/lecturer.api";

export default function LecturerAnalytics() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lecturerApi.getAnalytics(1)
    .then(data => {
        console.log("Analytics loaded:", data);
        setAnalytics(data);
    })
    .finally(() => setLoading(false));
  }, []);

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
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Course</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {analytics.neverSelected.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center" color="gray.400">All applicants have been approved at least once.</Td>
                  </Tr>
                ) : (
                  analytics.neverSelected.map((app: any, idx: number) => (
                    <Tr key={app.email + idx}>
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
                  <Th>Email</Th>
                  <Th>Total Approved</Th>
                </Tr>
              </Thead>
              <Tbody>
                {analytics.stats.length === 0 ? (
                  <Tr>
                    <Td colSpan={2} textAlign="center" color="gray.400">No data.</Td>
                  </Tr>
                ) : (
                  analytics.stats.map((row: any, idx: number) => (
                    <Tr key={row.email + idx}>
                      <Td>{row.email}</Td>
                      <Td>{row.count}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Box>
      <Footer />
    </Box>
  );
}