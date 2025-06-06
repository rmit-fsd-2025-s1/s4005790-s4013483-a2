import { Button, Checkbox, CheckboxGroup, FormControl, FormLabel, HStack, Select, Stack } from "@chakra-ui/react";
import { lecturerService, courseService, Lecturer, Course, lecturerProfileService } from "@/services/api";
import { useEffect, useState } from "react";

const LecturerCourses = () => {
    const [lecturer, setLecturer] = useState<Lecturer | null>(null);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

    async function setLecturersAndCourses() {
        const temp = await lecturerService.getAllLecturers();
        setLecturers(temp);
        setCourses(await courseService.getAllCoursesCodeName());
        setLecturer(temp[0]);
        setLecturerSelectedCourses(temp[0].profile.id);
    }

    useEffect(() => {
        setLecturersAndCourses();
    }, []);

    const setLecturerSelectedCourses = async (lecturerProfileId: string) => {
        const profileCourses = await lecturerProfileService.getLecturerProfileCourses(lecturerProfileId);
        setSelectedCourses(profileCourses.map((course) => ({ code: course.code, name: course.name })));
    }
    
    const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lecturerId = e.target.value;
        const lecturer = lecturers.find((lecturer) => lecturer.id === lecturerId);

        if (lecturer) {
            setLecturerSelectedCourses(lecturer.profile.id);
            setLecturer(lecturer);
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        const courseCode = e.target.value;

        setSelectedCourses(prevSelectedCourses => {
            if (isChecked) {
                const courseToAdd = courses.find(c => c.code === courseCode);
                if (courseToAdd && !prevSelectedCourses.some(c => c.code === courseCode)) {
                    return [...prevSelectedCourses, courseToAdd];
                }
                return prevSelectedCourses;
            } else {
                return prevSelectedCourses.filter(c => c.code !== courseCode);
            }
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (lecturer) {
            await lecturerProfileService.addCourseToLecturerProfile(selectedCourses.map((course) => course.code), lecturer.profile.id);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel fontSize="2xl" fontWeight="bold">Set Lecturer Courses</FormLabel>
                    <FormLabel fontWeight="bold">Lecturer</FormLabel>
                    <Select onChange={handleInputChange}>
                        {lecturers.map((lecturer) => (
                            <option value={lecturer.id}>{lecturer.name}</option>
                        ))}
                    </Select>
                    <FormLabel fontWeight="bold">Courses</FormLabel>
                    <HStack wrap="wrap" spacing={4}>
                        {courses.map((course) =>
                            selectedCourses.map((selectedCourse) => selectedCourse.code).includes(course.code) ? (
                                <Checkbox isChecked={true} value={course.code} onChange={handleCheckboxChange}>
                                    {course.name} ({course.code})
                                </Checkbox>
                            ) : (
                                <Checkbox value={course.code} onChange={handleCheckboxChange}>
                                    {course.name} ({course.code})
                                </Checkbox>
                            )
                        )}
                    </HStack>
                </FormControl>
                <Button type="submit" colorScheme="red">Set Courses</Button>
            </form>
        </>
    )
}

export default LecturerCourses;