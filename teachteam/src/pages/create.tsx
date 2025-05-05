import { ChakraProvider, Box, Heading, VStack, Text, Input, Button, FormControl, FormLabel, Link, RadioGroup, Radio } from "@chakra-ui/react";
import NextLink from "next/link";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { User } from "@/components/User";
import { useUser } from "@/context/UserContext";
import { tutorApi } from "@/services/tutor.api";
import { lecturerApi } from "@/services/lecturer.api";

//Add logic for specifically if email or password is incorrect
async function validateForm(user: User): Promise<User | string> {
  if (user.name.length === 0 || user.name.length > 40) {
    return "Name must be between 1 and 40 characters.";
  }

  if (user.email.length === 0 || user.email.length > 256) {
    return "Email must be between 1 and 255 characters.";
  }

  const emailExists = await Promise.all([
    tutorApi.getTutorByEmail(user.email),
    lecturerApi.getLecturerByEmail(user.email),
  ]).then(([tutor, lecturer]) => tutor || lecturer);

  if (emailExists) {
    return "This email already has an account.";
  }

  if (user.password.length === 0 || user.password.length > 100) {
    return "Password must be between 1 and 100 characters.";
  }
  //TODO: Add password strength check

  return user;
}

export default function SignUp() {
  const { setUser } = useUser();
  const [formError, setFormError] = useState<string | null>(null);
  const [user, setUserToCheck] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "Lecturer",
  });

  const router = useRouter();

  function handleInputChange(name: string, value: string) {
    setUserToCheck((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await validateForm(user);

    if (typeof result === "string") {
      setFormError(result);
    } else {
      setUser(result);
      if (result.role == "Lecturer") {
        router.push("/lecturer");
      } else {
        router.push("/tutor");
      }
    }
  }

  useEffect(() => {
    const userExists: string | null = localStorage.getItem("user");

    if (userExists) {
      router.push("/");
    }
  }, [router]);

  return (
    <ChakraProvider>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box
          as="main"
          flex="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
          p={8}
          textAlign="center"
        >
          <VStack>
            <Heading as="h1" size="md" color="#032e5b">
              Sign Up
            </Heading>
            <form onSubmit={handleSubmit}>
              <FormControl id="signup" isRequired>
                <FormLabel color="#032e5b">Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Enter your name"
                  value={user.name}
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                />
                <FormLabel color="#032e5b">Email</FormLabel>
                <Input
                  name="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                />
                <FormLabel color="#032e5b">Password</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                />
                <PasswordStrengthMeter value={0} />
                {formError && <Text color="red.500">{formError}</Text>}
                <FormLabel color="#032e5b">Role</FormLabel>
                <RadioGroup
                  name="role"
                  defaultValue="Tutor" 
                  value={user.role}
                  onChange={(value) => handleInputChange("role", value)}
                >
                  <Radio value="Lecturer">Lecturer</Radio>
                  <Radio value="Tutor">Tutor</Radio>
                </RadioGroup>
              </FormControl>
              <Button type="submit">Sign Up</Button>
            </form>
            <Link as={NextLink} href='/login'>Already have an account?</Link>
          </VStack>
        </Box>
        {/* Explicitly wrap Footer to enforce styles */}
        <Box bg="#032e5b">
          <Footer />
        </Box>
      </Box>
    </ChakraProvider>
  );
}
