import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "@/context/UserContext";
import { LecturerProfileProvider } from "@/context/LecturerProfileContext";
import { TutorProfileProvider } from "@/context/TutorProfileContext"; 
import { ApplicationsProvider } from "@/context/ApplicationsContext";
import { UsersListsProvider } from "@/context/UsersListsContext";
import { TutorsUnavailableProvider } from "@/context/TutorsUnavailableContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
    <TutorsUnavailableProvider>
    <UsersListsProvider>
    <TutorProfileProvider>
    <LecturerProfileProvider>
    <ApplicationsProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApplicationsProvider>
    </LecturerProfileProvider>
    </TutorProfileProvider>
    </UsersListsProvider>
    </TutorsUnavailableProvider>
    </UserProvider>
  );
}
