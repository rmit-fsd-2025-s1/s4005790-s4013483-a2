import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "@/context/UserContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { ApplicationsProvider } from "@/context/ApplicationsContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
    <ProfileProvider>
    <ApplicationsProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApplicationsProvider>
    </ProfileProvider>
    </UserProvider>
  );
}
