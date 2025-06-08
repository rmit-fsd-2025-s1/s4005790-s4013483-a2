import { Box, VStack, Select, Input, Text, Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { Course } from "./CoursesList";

interface ApplicantsSearchBarProps {
  courses: Course[];
  onSearch: (criteria: {
    courseCode: string;
    tutorName: string;
    sessionType: string;
    availability: string;
    skills: string[];
  }) => void;
}

// Map to your application's actual roles
const sessionTypes = [
  { label: "Tutorial (Tutor)", value: "Tutor" },
  { label: "Lab (Lab-Assistant)", value: "Lab Assistant" }
];

const SKILLS = [
  "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin",
  "PHP", "HTML", "CSS", "SQL", "NoSQL", "React", "Angular", "Vue", "Node.js", "Django"
];

const ApplicantsSearchBar = ({ courses, onSearch }: ApplicantsSearchBarProps) => {
  const [criteria, setCriteria] = useState({
    courseCode: "",
    tutorName: "",
    sessionType: "",
    availability: "",
    skills: [] as string[],
  });

  // Call onSearch on every change for real-time filtering
  const handleFieldChange = (field: string, value: string | number | (string | number)[]) => {
    const newCriteria = { ...criteria, [field]: value };
    setCriteria(newCriteria);
    onSearch(newCriteria);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={4} bg="#f8fafc" minW="260px" maxW="300px">
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontWeight="bold" mb={1}>Course</Text>
          <Select
            placeholder="Select Course"
            value={criteria.courseCode}
            onChange={e => handleFieldChange("courseCode", e.target.value)}
            bg="white"
          >
            {courses.map((course) => (
              <option key={course.code} value={course.code}>{course.name}</option>
            ))}
          </Select>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={1}>Tutor Name</Text>
          <Input
            placeholder="Type name"
            value={criteria.tutorName}
            onChange={e => handleFieldChange("tutorName", e.target.value)}
            bg="white"
          />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={1}>Session Type (Role)</Text>
          <Select
            placeholder="Select Type"
            value={criteria.sessionType}
            onChange={e => handleFieldChange("sessionType", e.target.value)}
            bg="white"
          >
            {sessionTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={1}>Availability</Text>
          <Select
            placeholder="Select Availability"
            value={criteria.availability}
            onChange={e => handleFieldChange("availability", e.target.value)}
            bg="white"
          >
            <option value="None">None</option>
            <option value="Part-time">Part-time</option>
            <option value="Full-time">Full-time</option>
          </Select>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={1}>Tutor Skills</Text>
          <CheckboxGroup
            colorScheme="teal"
            value={criteria.skills}
            onChange={(val) => handleFieldChange("skills", val)}
          >
            <Stack spacing={1} direction="column" maxH="110px" overflowY="auto" bg="white" p={2} borderRadius="md" borderWidth="1px">
              {SKILLS.map(skill => (
                <Checkbox value={skill} key={skill}>{skill}</Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </Box>
      </VStack>
    </Box>
  );
};

export default ApplicantsSearchBar;