import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Box, Grid, GridItem, Link, Button, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";

const Header = () => {
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  
  const handleSignOut = () => {
    setUser(null);
    router.push("/login");
  };

  const handleSignOutClick = () => {
    setIsOpen(true);
  };

  return (
    <Box as="header" w="100%" p={4} bg="white" boxShadow="md">
      <Grid templateColumns="1fr auto 1fr" alignItems="center">
        <GridItem></GridItem>
        <GridItem justifySelf="center">
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Image src="/teachteam-logo.png" alt="TeachTeam Logo" width="100" height="100" />
          </Link>
        </GridItem>
        <GridItem justifySelf="end">
          {user ? (
            <>
              <Button onClick={handleSignOutClick} colorScheme="red" variant="outline">
                Sign Out
              </Button>
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Confirm Sign Out
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to sign out?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={handleSignOut} ml={3}>
                        Yes
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          ) : (
            <Button as="a" href="/login" colorScheme="teal" variant="outline">
              Sign Up / Sign In
            </Button>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Header;
