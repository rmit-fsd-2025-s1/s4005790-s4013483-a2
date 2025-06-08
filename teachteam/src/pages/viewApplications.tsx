import { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Flex, Badge, Button, useToast, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "@/context/UserContext";
import { tutorApi } from "@/services/tutor.api";
import { Application } from "@/services/tutor.api";
import router from "next/router";

export default function ViewApplications() {
  const { user } = useUser();
  const toast = useToast();

  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [withdrawModal, setWithdrawModal] = useState<{
    open: boolean;
    application: Application | null;
  }>({ open: false, application: null });

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser || JSON.parse(localUser).role !== "Tutor") {
      router.push("/");
    }
  }, []);

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

  // Show confirmation modal
  const handleWithdrawClick = (application: Application) => {
    setWithdrawModal({ open: true, application });
  };

  // Withdraw confirmed: delete from backend
  const confirmWithdraw = async () => {
    const application = withdrawModal.application;
    if (!application) return;
    try {
      await tutorApi.deleteApplication(application.id);
      setUserApplications((prev) =>
        prev.filter((app) => app.id !== application.id)
      );
      toast({
        title: "Application Withdrawn",
        description: `You have successfully withdrawn your application for ${application.roles} of ${application.courseName}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to withdraw application.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setWithdrawModal({ open: false, application: null });
  };

  const handleModalClose = () => {
    setWithdrawModal({ open: false, application: null });
  };

  const handleDelete = async (courseCode: string, roles: string) => {
    // This is for rejected applications, update if you want to do real delete
    setUserApplications((prev) =>
      prev.filter(
        (app) => !(app.courseCode === courseCode && app.roles === roles)
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

  // Lighter background color and compact card style
  const cardBg = "#f7fafc"; // Chakra's gray.50
  const cardBorderColor = "#e2e8f0"; // Chakra's gray.200

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={{ base: 2, md: 8 }} textAlign="center">
        <Heading as="h1" mb={8} color="#032e5b">
          Your Applications
        </Heading>
        <VStack spacing={4} align="stretch">
          {userApplications.length === 0 && (
            <Text color="#032e5b" fontStyle="italic" opacity={0.6}>
              You have not applied for any courses yet.
            </Text>
          )}
          {userApplications.map((application, index) => (
            <Box
              key={application.id || index}
              p={4}
              borderWidth="1px"
              borderColor={cardBorderColor}
              borderRadius="lg"
              bg={cardBg}
              boxShadow="sm"
              _hover={{ boxShadow: "md", background: "#edf2f7" }}
              transition="all 0.2s"
            >
              <Flex
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={2}
              >
                <Flex gap={4} wrap="wrap">
                  <Box>
                    <Text color="#032e5b" fontWeight="bold">
                      {application.courseName}
                    </Text>
                    <Text color="#718096" fontSize="sm">
                      {application.courseCode}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme="blue"
                    fontSize="0.9em"
                    alignSelf="center"
                  >
                    {application.roles}
                  </Badge>
                  <Badge
                    colorScheme={
                      application.outcome === "Rejected"
                        ? "red"
                        : application.outcome === "Accepted"
                        ? "green"
                        : "orange"
                    }
                    fontSize="0.9em"
                    alignSelf="center"
                  >
                    {application.outcome || "Sent"}
                  </Badge>
                </Flex>
                <Flex gap={2} mt={{ base: 3, md: 0 }}>
                  {application.outcome === "Rejected" ? (
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(application.courseCode, application.roles)}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      colorScheme="orange"
                      size="sm"
                      onClick={() => handleWithdrawClick(application)}
                    >
                      Withdraw
                    </Button>
                  )}
                </Flex>
              </Flex>
              <Divider my={2} />
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={4}
                fontSize="sm"
                color="#032e5b"
                justify="space-between"
              >
                <Box flex={1} minW={0}>
                  <Text isTruncated title={application.expressionOfInterest}>
                    <strong>Expression of Interest:</strong>{" "}
                    {application.expressionOfInterest || (
                      <span style={{ opacity: 0.5 }}>None</span>
                    )}
                  </Text>
                </Box>
                <Box flex={1} minW={0}>
                  <Text isTruncated title={application.note}>
                    <strong>Note:</strong>{" "}
                    {application.note || (
                      <span style={{ opacity: 0.5 }}>None</span>
                    )}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={withdrawModal.open}
        onClose={handleModalClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw Application</ModalHeader>
          <ModalBody>
            <Text mb={4}>
              Do you want to withdraw your application to be a{" "}
              <strong>
                {withdrawModal.application?.roles}
              </strong>{" "}
              of <strong>{withdrawModal.application?.courseName}</strong>?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={confirmWithdraw}
            >
              Yes, I want to withdraw
            </Button>
            <Button
              colorScheme="gray"
              variant="outline"
              onClick={handleModalClose}
            >
              No, I changed my mind
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Footer />
    </Box>
  );
}