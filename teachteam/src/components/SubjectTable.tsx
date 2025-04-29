import { useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Link, Text, useDisclosure } from "@chakra-ui/react";
import { Course, courseList } from "./CoursesList";
import { useApplications } from "@/context/ApplicationsContext";
import RankApplicationsModal from "@/context/RankApplicationsModal";

const SubjectTable = () => {
  const { applications } = useApplications();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "",
    direction: null,
  });

  // Count approved applications for each course
  const getApprovedApplicationCount = (courseCode: string) => {
    return Array.from(applications.values())
      .flat()
      .filter((role) => role.course.code === courseCode && role.status === "Approved").length;
  };

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Cycle through asc, desc, and null
        const nextDirection =
          prevConfig.direction === "asc" ? "desc" : prevConfig.direction === "desc" ? null : "asc";
        return { key, direction: nextDirection };
      }
      return { key, direction: "asc" }; // Default to ascending if sorting a new column
    });
  };

  // Sort courses based on the current sort configuration
  const sortedCourses = [...courseList].sort((a, b) => {
    if (!sortConfig.direction) {
      return 0; // No sorting
    }
    const key = sortConfig.key;
    const aValue = key === "approvedApplications" ? getApprovedApplicationCount(a.code) : a[key as keyof Course];
    const bValue = key === "approvedApplications" ? getApprovedApplicationCount(b.code) : b[key as keyof Course];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSubjectClick = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
    onOpen();
  };

  return (
    <Box w="100%">
      <Table variant="simple" mb={8}>
        <Thead>
          <Tr>
            <Th
              color="#032e5b"
              cursor="pointer"
              onClick={() => handleSort("name")}
            >
              Course Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "")}
            </Th>
            <Th
              color="#032e5b"
              cursor="pointer"
              onClick={() => handleSort("code")}
            >
              Course Code {sortConfig.key === "code" && (sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "")}
            </Th>
            <Th
              color="#032e5b"
              cursor="pointer"
              onClick={() => handleSort("approvedApplications")}
            >
              Approved Applications {sortConfig.key === "approvedApplications" && (sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedCourses.map((course) => (
            <Tr key={course.code}>
              <Td>
                <Link onClick={() => handleSubjectClick(course.code)} color="teal.500" cursor="pointer">
                  {course.name}
                </Link>
              </Td>
              <Td color="#032e5b">{course.code}</Td>
              <Td color="#032e5b">{getApprovedApplicationCount(course.code)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Most and Least Approved Tutors */}
      <Box mb={8}>
        <Text fontWeight="bold" mb={2} color="#032e5b">Tutors Approval Stats:</Text>
        {/* Tutor stats logic omitted for brevity */}
      </Box>
      {/* Rank Applications Modal */}
      {selectedCourseCode && (
        <RankApplicationsModal
          isOpen={isOpen}
          onClose={onClose}
          courseCode={selectedCourseCode}
        />
      )}
    </Box>
  );
};

export default SubjectTable;
