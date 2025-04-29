import { ChakraProvider, Box, Heading, VStack, Text, Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usersList } from "@/components/UsersList";
import { User } from "@/components/User";
import { useUser } from "@/context/UserContext";

//Add logic for specifically if email or password is incorrect
function validateForm(user: { email: string; password: string }): User | string {
  const userExists = usersList.find((u: User) => u.email === user.email && u.password === user.password);

  if (userExists) {
    return userExists;
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateForm(user);

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
