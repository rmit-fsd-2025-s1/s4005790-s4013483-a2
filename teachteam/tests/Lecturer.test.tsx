import React from "react";
import Lecturer from "@/pages/lecturer";
import { render, screen } from "@testing-library/react";
import { useUser } from "@/context/UserContext";
import { useApplications } from "@/context/ApplicationsContext";
import { usersList } from "@/components/UsersList";
import { rolesList } from "@/components/RolesList";

// Mocks router to be able to render Lecturer
jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mocks UserContext to set the user Lecturer sees
jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

// Mocks UserContext to set the user Lecturer sees
jest.mock("@/context/ApplicationsContext", () => ({
  applications: new Map(),
  useApplications: jest.fn(),
}));

// Mock variables
const mockUser = usersList[0];
const mockAppliedRole = rolesList[0];

describe("Lecturer", () => {
  it("Renders all tutor applications when no filters are applied", () => {
    // Sets user to mockUser
    (useUser as jest.Mock).mockReturnValue({user : mockUser });
    // Sets applications to a Map with mockUser and mockAppliedRole
    (useApplications as jest.Mock).mockReturnValue({
      applications : new Map([[mockUser.email, [mockAppliedRole]]]),
      setApplications: jest.fn(),
    });

    render(<Lecturer />);

    // Check if the applied application shows up
    expect(
      screen.getByText((content, element) =>
        element?.textContent === `Course: ${mockAppliedRole.course.name}`
    )).toBeInTheDocument();
  });
});

