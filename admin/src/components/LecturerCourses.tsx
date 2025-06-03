import { Checkbox, CheckboxGroup, FormControl, FormLabel, Select, Stack } from "@chakra-ui/react";
import { lecturerService, courseService, Lecturer, Course, lecturerProfileService } from "@/services/api";
import { useEffect, useState } from "react";

const LecturerCourses = () => {
    const [lecturer, setLecturer] = useState<Lecturer | null>(null);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

    async function setLecturersAndCourses() {
        setLecturers(await lecturerService.getAllLecturers());
        setCourses(await courseService.getAllCourses());
    }

    useEffect(() => {
        setLecturersAndCourses();
    }, []);
    
    const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(lecturers);
        const lecturerId = e.target.value;
        const lecturer = lecturers.find((lecturer) => lecturer.id === lecturerId);

        if (lecturer) {
            const profileCourses = await lecturerProfileService.getLecturerProfileCourses(lecturer.profile.id);
            console.log(profileCourses);
            setSelectedCourses(profileCourses.map((course) => ({ code: course.code, name: course.name })));
        }
    }

    return (
        <>
            <FormControl>
                <FormLabel>Lecturer</FormLabel>
                <Select onChange={handleInputChange}>
                    {lecturers.map((lecturer) => (
                        <option value={lecturer.id}>{lecturer.name}</option>
                    ))}
                </Select>
                <FormLabel>Courses</FormLabel>
                <Stack>
                    {courses.map((course) =>
                        selectedCourses.map((selectedCourse) => selectedCourse.code).includes(course.code) ? (
                            <Checkbox defaultChecked textColor="green" value={course.code}>
                                {course.name} ({course.code})
                            </Checkbox>
                        ) : (
                            <Checkbox value={course.code}>
                                {course.name} ({course.code})
                            </Checkbox>
                        )
                    )}
                </Stack>
            </FormControl>
        </>
    )
}

export default LecturerCourses;