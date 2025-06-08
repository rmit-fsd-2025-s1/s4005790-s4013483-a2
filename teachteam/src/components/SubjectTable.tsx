import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useDisclosure,
  TableContainer,
  Heading,
  Button,
  ButtonGroup
} from "@chakra-ui/react";
import RankApplicationsModal from "@/context/RankApplicationsModal";
import { Course } from "./CoursesList";

interface Application {
  id: number;
  email: string;
  courseCode: string;
  outcome: string;
  roles: string; // Ensure this is present
}

interface SubjectTableProps {
  courses: Course[];
  applications: Application[];
}

const SubjectTable = ({ courses, applications }: SubjectTableProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("Tutor");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "",
    direction: null,
  });

  const getApprovedApplicationCount = (courseCode: string) =>
    applications.filter(app => app.courseCode === courseCode && app.outcome === "Approved").length;

  const getReceivedApplicationCount = (courseCode: string) =>
    applications.filter(app => app.courseCode === courseCode).length;

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        const nextDirection =
          prevConfig.direction === "asc"
            ? "desc"
            : prevConfig.direction === "desc"
            ? null
            : "asc";
        return { key, direction: nextDirection };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (!sortConfig.direction) return 0;
    const key = sortConfig.key;
    let aValue: number | string | string[];
    let bValue: number | string | string[];
    if (key === "approvedApplications") {
      aValue = getApprovedApplicationCount(a.code);
      bValue = getApprovedApplicationCount(b.code);
    } else if (key === "receivedApplications") {
      aValue = getReceivedApplicationCount(a.code);
      bValue = getReceivedApplicationCount(b.code);
    } else {
      aValue = a[key as keyof Course];
      bValue = b[key as keyof Course];
    }
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSubjectClick = (courseCode: string, role: string) => {
    setSelectedCourseCode(courseCode);
    setSelectedRole(role);
    onOpen();
  };

  return (
    <Box w="100%">
      <Heading as="h2" size="md" mb={3} color="#032e5b" textAlign="center">
        Subjects Managed
      </Heading>
      <TableContainer maxW="100%" overflowX="hidden" maxHeight="650px">
        <Table variant="simple" size="sm" minW="340px" maxW="100%">
          <Thead>
            <Tr>
              <Th
                color="#032e5b"
                cursor="pointer"
                onClick={() => handleSort("name")}
                minW="120px"
                p={1}
                fontSize="sm"
                textAlign="left"
              >
                Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "")}
              </Th>
              <Th
                color="#032e5b"
                cursor="pointer"
                onClick={() => handleSort("code")}
                minW="60px"
                p={1}
                fontSize="sm"
                textAlign="left"
              >
                Code {sortConfig.key === "code" && (sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "")}
              </Th>
              <Th
                color="#032e5b"
                cursor="pointer"
                onClick={() => handleSort("receivedApplications")}
                minW="70px"
                p={1}
                fontSize="sm"
                textAlign="center"
              >
                Received {sortConfig.key === "receivedApplications" && (sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "")}
              </Th>
              <Th
                color="#032e5b"
                cursor="pointer"
                onClick={() => handleSort("approvedApplications")}
                minW="70px"
                p={1}
                fontSize="sm"
                textAlign="center"
              >
                Approved {sortConfig.key === "approvedApplications" && (sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "")}
              </Th>
              <Th color="#032e5b" p={1} fontSize="sm" textAlign="center" minW="120px">
                Rank Applications
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedCourses.map((course) => (
              <Tr key={course.code}>
                <Td
                  p={1}
                  fontSize="sm"
                  minW="120px"
                  maxW="220px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                >
                  {/* Not clickable anymore */}
                  <Text color="#032e5b">{course.name}</Text>
                </Td>
                <Td p={1} fontSize="sm" color="#032e5b" minW="60px" maxW="80px">{course.code}</Td>
                <Td p={1} fontSize="sm" color="#032e5b" textAlign="center" minW="70px">{getReceivedApplicationCount(course.code)}</Td>
                <Td p={1} fontSize="sm" color="#032e5b" textAlign="center" minW="70px">{getApprovedApplicationCount(course.code)}</Td>
                <Td p={1} fontSize="sm" textAlign="center" minW="120px">
                  <ButtonGroup size="sm" variant="outline">
                    <Button colorScheme="teal" onClick={() => handleSubjectClick(course.code, "Tutor")}>
                      Rank Tutors
                    </Button>
                    <Button colorScheme="purple" onClick={() => handleSubjectClick(course.code, "Lab-Assistant")}>
                      Rank Lab-Assistants
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mb={4}>
        <Text fontWeight="bold" mb={2} color="#032e5b" fontSize="sm">Tutors Approval Stats:</Text>
        {/* Tutor stats logic omitted for brevity */}
      </Box>
      {/* Rank Applications Modal */}
      {selectedCourseCode && (
        <RankApplicationsModal
          isOpen={isOpen}
          onClose={onClose}
          courseCode={selectedCourseCode}
          role={selectedRole}
          applications={applications.filter(app =>
            app.courseCode === selectedCourseCode &&
            app.outcome === "Approved" &&
            app.roles === selectedRole
          )}
        />
      )}
    </Box>
  );
};

export default SubjectTable;