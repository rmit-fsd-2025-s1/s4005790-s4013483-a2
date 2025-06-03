import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box textColor="#8db158" as="footer" w="100%" p={4} bg="#032e5b" boxShadow="md" mt={8}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">RMIT University:</Text>
          <Text>School of Computer Science</Text>
          <Text>Address: 124 La Trobe St, Melbourne VIC 3000, Australia</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Contact:</Text>
          <Text>Email: contact@teachteam.com</Text>
          <Text>Phone: +61 3 9925 2000</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Footer;