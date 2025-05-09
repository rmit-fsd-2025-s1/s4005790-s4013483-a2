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
import bcrypt from "bcryptjs";

//Add logic for specifically if email or password is incorrect
async function validateForm(user: User): Promise<User | string> {
  if (user.name.length < 1 || user.name.length > 40) {
    return "Name must be between 1 and 40 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return "Invalid email address.";
  }

  if (user.email.length < 1 || user.email.length > 256) {
    return "Email must be between 1 and 255 characters.";
  }

  const [tutorResult, lecturerResult] = await Promise.allSettled([
    tutorApi.getTutorByEmail(user.email),
    lecturerApi.getLecturerByEmail(user.email),
  ]);

  const tutor = tutorResult.status === "fulfilled" ? tutorResult.value : null;
  const lecturer = lecturerResult.status === "fulfilled" ? lecturerResult.value : null;
  const emailExists = tutor || lecturer;

  if (emailExists) {
    return "This email already has an account.";
  }

  if (user.password.length < 8 || user.password.length > 100) {
    return "Password must be between 8 and 100 characters.";
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z]).{8,}$/;
  if (!passwordRegex.test(user.password)) {
    return "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.";
  }

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
      const hashedPassword = bcrypt.hashSync(result.password, 10);
      setUser(result);
      
      if (result.role === "Lecturer") {
        try {
          await lecturerApi.createLecturer({
            name: result.name,
            email: result.email,
            password: hashedPassword
          });
          
          router.push("/lecturer");
        } catch (error) {
          setFormError("Error creating lecturer account. Please try again.");
          console.error("Error creating lecturer:", error);
        }
      } else {
        try {
          await tutorApi.createTutor({
            name: result.name,
            email: result.email,
            password: hashedPassword,
          });
          router.push("/tutor");
        } catch (error) {
          setFormError("Error creating tutor account. Please try again.");
          console.error("Error creating tutor:", error);
        }
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
              {formError && <Text color="red.500" wordBreak={"break-word"}>{formError}</Text>}
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
