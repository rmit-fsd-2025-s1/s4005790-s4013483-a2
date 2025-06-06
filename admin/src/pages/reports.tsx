import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button, FormControl, Select, Tr, Thead, Table, TableContainer, Th, Td, Tbody } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Application, applicationService, Course, courseService, Tutor, tutorService } from "@/services/api";

export default function Reports() {
    const [reportType, setReportType] = useState<"1" | "2" | "3">("1");
    const [submitted, setSubmitted] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);

    const loadData = async () => {
        const tutors = await tutorService.getAllTutors();
        const applications = await applicationService.getAllApplications();
        const courses = await courseService.getAllCourses();

        setTutors(tutors);
        setApplications(applications);
        setCourses(courses);
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setReportType(e.target.value as "1" | "2" | "3");
        setSubmitted(false);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loadData();
        setSubmitted(true);
    }

    return (
        <>
            <Header />
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <Select onChange={handleChange}>
                        <option value="1">Candidates chosen by course</option>
                        <option value="2">Candidates chosen for more than 3 courses</option>
                        <option value="3">Candidates not chosen</option>
                    </Select>
                    <Button type="submit">Generate Report</Button>
                </FormControl>
            </form>
            {submitted && reportType === "1" && (
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Course</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {courses.map((course) => (
                            <Tr key={course.code}>
                                <Td>{course.name} ({course.code})</Td>
                                <Td>
                                    {tutors.filter((tutor) => applications.some((application) => application.email === tutor.email && application.courseCode === course.code))
                                    .map(tutor => tutor.name).join(", ")}
                                </Td>
                                <Td>
                                    {tutors.filter((tutor) => applications.some((application) => application.email === tutor.email && application.courseCode === course.code))
                                    .map(tutor => tutor.email).join(", ")}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            )}
            {submitted && (reportType === "2" || reportType === "3") && (
                <TableContainer>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Email</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tutors.filter((tutor) => {
                                const approvedCount = applications.filter((application) => application.email === tutor.email && application.outcome === "Approved").length;

                                if (reportType === "2") {
                                    return approvedCount > 3;
                                }
                                else if (reportType === "3") {
                                    return approvedCount === 0 || !applications.some(application => application.email == tutor.email);
                                }
                                return false;
                            }).map((tutor) => (
                                <Tr key={tutor.email}>
                                    <Td>{tutor.name}</Td>
                                    <Td>{tutor.email}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
            <Footer />
        </>
    );
}