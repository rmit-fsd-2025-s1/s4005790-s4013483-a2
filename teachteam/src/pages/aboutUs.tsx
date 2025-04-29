import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" w="100%" p={8} textAlign="center">
        <Heading as="h1" mb={8} color="#032e5b">
          About Us
        </Heading>
        <VStack spacing={8} align="stretch" px={20}>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Text color="#032e5b">
              Welcome to TeachTeam (TT), a purpose-driven platform designed to revolutionize how casual tutors are selected and hired for courses at the School of Computer Science.
            </Text>
          </Box>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Text color="#032e5b">
              Developed by a dedicated team selected by the university, TT is more than just a web system—it’s a commitment to empowering educators, streamlining processes, and fostering academic excellence. Our goal is to simplify and enhance the recruitment journey, connecting qualified and passionate tutors with teaching opportunities that inspire growth and innovation in the field of computer science.
            </Text>
          </Box>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Text color="#032e5b">
              With user-centric design at its core, TeachTeam is built to ensure efficiency, transparency, and accessibility. We understand the importance of matching the right talent to the right courses, and that’s why we’ve tailored our platform to meet the unique needs of students, tutors, and academic staff alike.
            </Text>
          </Box>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Text color="#032e5b">
              At TT, we’re proud to contribute to the future of education by enabling impactful connections and helping shape the next generation of computer science leaders.
            </Text>
          </Box>
          <Box textAlign="left" p={4} borderWidth="1px" borderRadius="lg">
            <Text color="#032e5b">
              Join us on this journey, where technology meets opportunity. Together, we make teaching and learning thrive.
            </Text>
          </Box>
        </VStack>
      </Box>
      <Footer />
    </Box>
  );
};

export default AboutUs;