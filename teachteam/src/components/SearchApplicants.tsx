import React, { useState } from "react";
import { Box, Input, Select, Button, VStack, HStack } from "@chakra-ui/react";
import { useApplications } from "@/context/ApplicationsContext";
import { useProfile } from "@/context/ProfileContext";
import { courseList } from "@/components/CoursesList";
import { usersList } from "@/components/UsersList";

const SearchApplicants = ({ onSearchResults }: { onSearchResults: (results: any[]) => void }) => {
  const { applications } = useApplications();
  const { profiles } = useProfile();

  const [courseName, setCourseName] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [availability, setAvailability] = useState("");
  const [skill, setSkill] = useState("");

  const handleSearch = () => {
    const results = Array.from(applications.entries())
      .flatMap(([email, roles]) => {
        const profile = profiles.get(email);
        const user = usersList.find((u) => u.email === email);

        return roles.map((role) => {
          const course = courseList.find((c) => c.code === role.course.code);

          return {
            tutorName: user?.name || "Unknown",
            courseName: course?.name || "Unknown",
            availability: profile?.availability || "Unknown",
            skills: profile?.skills || "",
            ...role,
          };
        });
      })
      .filter((applicant) => {
        const matchesCourseName =
          courseName === "" || applicant.courseName.toLowerCase().includes(courseName.toLowerCase());
        const matchesTutorName =
          tutorName === "" || applicant.tutorName.toLowerCase().includes(tutorName.toLowerCase());
        const matchesAvailability =
          availability === "" || applicant.availability === availability;
        const matchesSkill =
          skill === "" || applicant.skills.toLowerCase().includes(skill.toLowerCase());

        return matchesCourseName && matchesTutorName && matchesAvailability && matchesSkill;
      });

    onSearchResults(results);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
      <VStack spacing={4}>
        <HStack w="100%" spacing={4}>
          <Input
            placeholder="Search by Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <Input
            placeholder="Search by Tutor Name"
            value={tutorName}
            onChange={(e) => setTutorName(e.target.value)}
          />
        </HStack>
        <HStack w="100%" spacing={4}>
          <Select
            placeholder="Select Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="None">None</option>
            <option value="Part-time">Part-time</option>
            <option value="Full-time">Full-time</option>
          </Select>
          <Input
            placeholder="Search by Skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </HStack>
        <Button colorScheme="teal" onClick={handleSearch}>
          Search
        </Button>
      </VStack>
    </Box>
  );
};

export default SearchApplicants;
