import React from "react";
import Tutor from "@/pages/tutor";
import { fireEvent, render, screen } from "@testing-library/react";
import { useUser } from "@/context/UserContext";
import { useApplications } from "@/context/ApplicationsContext";
import { usersList } from "@/components/UsersList";
import { rolesList } from "@/components/RolesList";
import { courseList } from "@/components/CoursesList";

// Mocks router to be able to render Header
jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mocks UserContext to set the user Header sees
jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

// Mocks UserContext to set the user Header sees
jest.mock("@/context/ApplicationsContext", () => ({
  applications: new Map(),
  useApplications: jest.fn(),
}));

// Mock variables
const mockUser = usersList[0];
const mockAppliedRole = rolesList[0];

describe("Tutor", () => {
  it("Renders all available applications when applications is empty", () => {
    // Sets user to mockUser
    (useUser as jest.Mock).mockReturnValue({user : mockUser });
    // Sets applications to empty Map
    (useApplications as jest.Mock).mockReturnValue({
      applications : new Map(),
      setApplications: jest.fn(),
    });

    render(<Tutor />);

    // Select all courses
    fireEvent.click(screen.getByText("Select Courses"));
    courseList.forEach((course) => {
      fireEvent.click(screen.getByText(course.name));
    });

    // Check if all courses should show up
    courseList
      .filter((course) => course.code)
      .forEach((course) => {
        expect(
          screen.getByText((content, element) =>
            element?.textContent === `Course: ${course.name} (${course.code})`
      )).toBeInTheDocument();
    });
  });

  it("Renders all available applications other than the mockAppliedRole already applied to", () => {
    // Sets user to mockUser
    (useUser as jest.Mock).mockReturnValue({user : mockUser });
    // Sets applications to a Map with mockUser and mockAppliedRole
    (useApplications as jest.Mock).mockReturnValue({
      applications : new Map([[mockUser.email, [mockAppliedRole]]]),
      setApplications: jest.fn(),
    });

    render(<Tutor />);

    // Select all courses
    fireEvent.click(screen.getByText("Select Courses"));
    courseList.forEach((course) => {
      fireEvent.click(screen.getByText(course.name));
    });

    // Check that the mockAppliedRole isn't showing up
    expect(
      screen.queryByText((content, element) =>
        element?.textContent === `Course: ${mockAppliedRole.course.name} (${mockAppliedRole.course.code})`
      )
    ).not.toBeInTheDocument();

    // Check that all roles other than the mockAppliedRole is showing up
    courseList
      .filter((course) => course.code !== mockAppliedRole.course.code)
      .forEach((course) => {
        expect(
          screen.getByText((content, element) =>
            element?.textContent === `Course: ${course.name} (${course.code})`
      )).toBeInTheDocument();
    });
  });
});
