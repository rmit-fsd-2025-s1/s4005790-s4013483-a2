import { Box, Heading, Text, VStack, Grid, GridItem, Button, useToast } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "@/context/UserContext";
import { useApplications } from "@/context/ApplicationsContext";

export default function ViewApplications() {
  const { user } = useUser();
  const { applications, setApplications } = useApplications();
  const toast = useToast();

  const userApplications = applications.get(user?.email) || [];

  const handleWithdraw = (courseCode) => {
    setApplications((prevApplications) => {
      const newApplications = new Map(prevApplications);
      const updatedRoles = newApplications.get(user?.email)?.filter(
        (role) => role.course.code !== courseCode
      );
      if (updatedRoles?.length > 0) {
        newApplications.set(user?.email, updatedRoles);
      } else {
        newApplications.delete(user?.email);
      }
      return newApplications;
    });
    toast({
      title: "Application Withdrawn",
      description: `You have successfully withdrawn your application for course ${courseCode}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = (courseCode) => {
    setApplications((prevApplications) => {
      const newApplications = new Map(prevApplications);
      const updatedRoles = newApplications.get(user?.email)?.filter(
        (role) => role.course.code !== courseCode
      );
      if (updatedRoles?.length > 0) {
        newApplications.set(user?.email, updatedRoles);
      } else {
        newApplications.delete(user?.email);
      }
      return newApplications;
    });
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
                  <Text color="#032e5b"><strong>Course:</strong> {application.course.name}</Text>
                </GridItem>
                <GridItem>
                  <Text color="#032e5b"><strong>Code:</strong> {application.course.code}</Text>
                </GridItem>
                <GridItem>
                  <Text color="#032e5b"><strong>Role:</strong> {application.role}</Text>
                </GridItem>
                <GridItem>
                  <Text color="#032e5b"><strong>Outcome:</strong> {application.status || "Sent"}</Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text color="#032e5b"><strong>Expression of Interest:</strong> {application.expressionOfInterest}</Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text color="#032e5b"><strong>Note:</strong> {application.note}</Text>
                </GridItem>
                <GridItem colSpan={2} color="#032e5b">
                  {application.status === "Rejected" ? (
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(application.course.code)}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      colorScheme="orange"
                      onClick={() => handleWithdraw(application.course.code)}
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