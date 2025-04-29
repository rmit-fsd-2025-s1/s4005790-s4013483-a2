import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const MainContent = () => {
  return (
    <Box as="main" w="100%" p={8} textAlign="center">
      <Box>
        <Heading as="h1" mb={8} color="#032e5b">
          Welcome to TeachTeam!
        </Heading>
        <VStack spacing={8} align="stretch" px={20}>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="md" color="#032e5b">About Us</Heading>
            <Text color="#032e5b">
              TeachTeam (TT) is a website dedicated to the selection and hiring of casual tutors for courses offered at the School of Computer Science. Our system streamlines the hiring process, facilitating robust interactions among tutor applicants and lecturers.
            </Text>
          </Box>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="md" color="#032e5b">Role: Tutor</Heading>
            <Text fontWeight="bold" color="#032e5b">Requirements:</Text>
            <Text color="#032e5b">- Bachelor&apos;s degree in Computer Science or related field</Text>
            <Text color="#032e5b">- Teaching experience</Text>
            <Text color="#032e5b">- Excellent communication skills</Text>
            <Text fontWeight="bold" mt={4} color="#032e5b">About Role:</Text>
            <Text color="#032e5b">The tutor will assist in teaching courses, grading assignments, and providing support to students.</Text>
          </Box>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="md" color="#032e5b">Role: Lecturer</Heading>
            <Text fontWeight="bold" color="#032e5b">Requirements:</Text>
            <Text color="#032e5b">- PhD in Computer Science or related field</Text>
            <Text color="#032e5b">- Extensive teaching and research experience</Text>
            <Text color="#032e5b">- Strong leadership skills</Text>
            <Text fontWeight="bold" mt={4} color="#032e5b">About Role:</Text>
            <Text color="#032e5b">The lecturer will lead courses, conduct research, and mentor students and tutors.</Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default MainContent;
