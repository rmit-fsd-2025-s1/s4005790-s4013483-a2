import { ChakraProvider, Box, Heading, VStack, Text, Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs";
import { adminService } from "../services/api";
import { useUser } from "@/context/UserContext";
import { User } from "@/components/User";

// Add logic for specifically if email or password is incorrect
async function validateForm(user: User): Promise<User | string> {
  const admins = await adminService.getAllAdmins();
  let admin = null;
  for (const a of admins) {
    if (a.username === user.username && await bcrypt.compare(user.password, a.password)) {
      admin = a;
      break;
    }
  }

  if (!admin) {
    return "Your login is incorrect!";
  }

  return {
    username: admin.username,
    password: admin.password,
  };
}

export default function Login() {
  const { user, setUser } = useUser();
  const [userToCheck, setUserToCheck] = useState<User>({
    username: "",
    password: "",
  }); 
  const [formError, setFormError] = useState<string | null>(null);

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
    const result = await validateForm(userToCheck);
    if (result === "Your login is incorrect!") {
      setFormError(result);
    } else {
      setUser(result as User);
      router.push("/");
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
                <FormLabel color="#032e5b">Username</FormLabel>
                <Input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={userToCheck.username}
                  onChange={handleInputChange}
                />
                <FormLabel color="#032e5b">Password</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="Enter your password"
                  value={userToCheck.password}
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
