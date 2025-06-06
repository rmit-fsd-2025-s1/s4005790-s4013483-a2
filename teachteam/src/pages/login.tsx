import { ChakraProvider, Box, Heading, VStack, Text, Input, Button, FormControl, FormLabel, Link } from "@chakra-ui/react";
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
import bcrypt from "bcryptjs";

// Add logic for specifically if email or password is incorrect
async function validateForm(user: { email: string; password: string }): Promise<Omit<User, 'password'> | string> {
  const [tutorResult, lecturerResult] = await Promise.allSettled([
    tutorApi.getTutorByEmail(user.email),
    lecturerApi.getLecturerByEmail(user.email),
  ]);

  // Checks if the user exists in either tutor/lecturer and adds role
  const userExists = tutorResult.status === "fulfilled"
    ? { ...tutorResult.value, role: "Tutor" }
    : lecturerResult.status === "fulfilled"
    ? { ...lecturerResult.value, role: "Lecturer" }
    : null;

  if (userExists && await bcrypt.compare(user.password, userExists.password)) {
    if (userExists.blocked) {
      return "Your account is blocked!";
    }
    return  { 
      email: userExists.email,
      role: userExists.role,
      name: userExists.name
    };
  }

  return "Your login is incorrect!";
}

export default function Login() {
  const { setUser } = useUser();
  const [formError, setFormError] = useState<string | null>(null);
  const [user, setUserToCheck] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const router = useRouter();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setUserToCheck((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await validateForm(user);
    // const result = user;

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
              Sign In
            </Heading>
            <form onSubmit={handleSubmit}>
              <FormControl id="signin" isRequired>
                <FormLabel color="#032e5b">Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={handleInputChange}
                />
                <FormLabel color="#032e5b">Password</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={handleInputChange}
                />
                <PasswordStrengthMeter value={0} />
                {formError && <Text color="red.500">{formError}</Text>}
              </FormControl>
              <Button type="submit">Sign In</Button>
            </form>
            <Link as={NextLink} href='/create'>Create Account</Link>
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
