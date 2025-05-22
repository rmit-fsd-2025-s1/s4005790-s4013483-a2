import { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Grid, GridItem, Button, useToast } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "@/context/UserContext";
import { tutorApi } from "@/services/tutor.api";

export default function ViewApplications() {
  const { user } = useUser();
  const toast = useToast();

  // New: Store user's applications from backend
  const [userApplications, setUserApplications] = useState<any[]>([]);

  // Fetch user's applications from backend on mount or when user changes
  useEffect(() => {
    const fetchApplications = async () => {
      if (user?.email) {
        try {
          const apps = await tutorApi.getApplicationsByUser(user.email);
          setUserApplications(apps);
        } catch {
          setUserApplications([]);
        }
      }
    };
    fetchApplications();
  }, [user?.email]);

  // Optionally: Implement withdraw/delete functionality with backend
  // For now, just remove from local state (UI only)
  const handleWithdraw = (courseCode, roles) => {
    setUserApplications((prev) =>
      prev.filter(
        (app) =>
          !(app.courseCode === courseCode && app.roles === roles)
      )
    );
    toast({
      title: "Application Withdrawn",
      description: `You have successfully withdrawn your application for course ${courseCode}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = (courseCode, roles) => {
    setUserApplications((prev) =>
      prev.filter(
        (app) =>
          !(app.courseCode === courseCode && app.roles === roles)
      )
    );
    toast({
      title: "Application Deleted",
      description: `You have successfully deleted the rejected application for course ${courseCode}.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={8} textAlign="center">
        <Heading as="h1" mb={8} color="#032e5b">
          Your Applications
        </Heading>
        <VStack spacing={4} align="stretch">
          {userApplications.map((application, index) => (
            <Box key={index} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <Text color="#032e5b">
                    <strong>Course:</strong> {application.courseName}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text color="#032e5b">
                    <strong>Code:</strong> {application.courseCode}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text color="#032e5b">
                    <strong>Role:</strong> {application.roles}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text color="#032e5b">
                    <strong>Outcome:</strong> {application.outcome || "Sent"}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text color="#032e5b">
                    <strong>Expression of Interest:</strong> {application.expressionOfInterest}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text color="#032e5b">
                    <strong>Note:</strong> {application.note}
                  </Text>
                </GridItem>
                <GridItem colSpan={2} color="#032e5b">
                  {application.outcome === "Rejected" ? (
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(application.courseCode, application.roles)}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      colorScheme="orange"
                      onClick={() => handleWithdraw(application.courseCode, application.roles)}
                    >
                      Withdraw
                    </Button>
                  )}
                </GridItem>
              </Grid>
            </Box>
          ))}
        </VStack>
      </Box>
      <Footer />
    </Box>
  );
}