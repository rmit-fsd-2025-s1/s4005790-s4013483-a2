import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";

// Mocks router to be able to render Header
jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mocks UserContext to set the user Header sees
jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("Header", () => {
  it("Renders 'Sign Up / Sign In' if user is null", () => {
    // Sets user to null
    (useUser as jest.Mock).mockReturnValue({user : null });

    render(<Header />);
    // Checks if "Sign Up / Sign In" exists
    expect(screen.getByText("Sign Up / Sign In")).toBeInTheDocument();
  });

  it("Renders 'Sign Out' if user is not null", () => {
    // Sets user to something that isn't null
    (useUser as jest.Mock).mockReturnValue({ user: { role: "Tutor" }, setUser: jest.fn() });

    render(<Header />);
    // Checks if "Sign Out" exists
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});

