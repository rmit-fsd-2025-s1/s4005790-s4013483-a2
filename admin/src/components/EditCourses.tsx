import { Course, courseService } from "@/services/api";
import { Button, Checkbox, FormControl, FormLabel, HStack, Input, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const skillsList = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "Ruby",
    "Go",
    "Swift",
    "Kotlin",
    "PHP",
    "HTML",
    "CSS",
    "SQL",
    "NoSQL",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Django",
];

const EditCourses = () => {
    const [action, setAction] = useState<"Add" | "Delete" | "Edit">("Add");
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course>({
        code: "",
        name: "",
        description: "",
        skills: [],
    });
    const [course, setCourse] = useState<Course>({
        code: "",
        name: "",
        description: "",
        skills: [],
    });
    const router = useRouter();

    async function getCourses() {
        const temp = await courseService.getAllCourses();
        setCourses(temp);
        setSelectedCourse(temp[0]);
    }

    useEffect(() => {
        getCourses();
    }, []);
    
    const coursesAsSelectOptions = () => {
        return (
            <Select onChange={(e) => setSelectedCourse(courses.find((course) => course.code === e.target.value) || {
                code: "",
                name: "",
                description: "",
                skills: [],
            })}>
                {courses.map((course) => (
                    <option key={course.code} value={course.code}>{course.name} ({course.code})</option>
                ))}
            </Select>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (action === "Add") {
            setCourse({ ...course, [e.target.name]: e.target.value });
        }
        else if (action === "Edit") {
            if (selectedCourse) {
                setSelectedCourse({ ...selectedCourse, [e.target.name]: e.target.value });
            }
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        const skill = e.target.value;

        if (action === "Add") {
            setCourse(prevCourse => {
                if (isChecked) {
                    if (skill && !prevCourse?.skills?.includes(skill)) {
                        return { ...prevCourse, skills: [...(prevCourse?.skills || []), skill] };
                    }
                    return prevCourse;
                } else {
                    return { ...prevCourse, skills: prevCourse?.skills?.filter((c: string) => c !== skill) || [] };
                }
            });
        }
        else if (action === "Edit") {
            setSelectedCourse(prevSelectedCourse => {
                if (isChecked) {
                    if (skill && !prevSelectedCourse?.skills?.includes(skill)) {
                        return { ...prevSelectedCourse, skills: [...(prevSelectedCourse?.skills || []), skill] };
                    }
                    return prevSelectedCourse;
                } else {
                    return { ...prevSelectedCourse, skills: prevSelectedCourse?.skills?.filter((c: string) => c !== skill) || [] };
                }
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (action === "Add") {
            await courseService.addCourse(course);
            router.refresh();
        }
        else if (action === "Delete") {
            await courseService.deleteCourse(selectedCourse.code);
            router.refresh();
        }
        else if (action === "Edit") {
            await courseService.updateCourse(selectedCourse);
            router.refresh();
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel textAlign="center" fontSize="2xl" fontWeight="bold">Modify Semester Courses</FormLabel>
                    <FormLabel fontWeight="bold">Action</FormLabel>
                    <Select onChange={(e) => setAction(e.target.value as "Add" | "Delete" | "Edit")} value={action}>
                        <option value="Add">Add</option>
                        <option value="Delete">Delete</option>
                        <option value="Edit">Edit</option>
                    </Select>
                    {action === "Add" && (
                        <>
                            <FormLabel fontWeight="bold">Course Code</FormLabel>
                            <Input name="code" value={course.code} onChange={handleChange} />
                            <FormLabel fontWeight="bold">Course Name</FormLabel>
                            <Input name="name" value={course.name} onChange={handleChange} />
                            <FormLabel fontWeight="bold">Course Description</FormLabel>
                            <Input name="description" value={course.description} onChange={handleChange} />
                            <FormLabel fontWeight="bold">Course Skills</FormLabel>
                            <HStack wrap="wrap">
                                {skillsList.map((skill) => (
                                    <Checkbox key={skill} value={skill} onChange={handleCheckboxChange} name="skills">{skill}</Checkbox>
                                ))}
                            </HStack>
                        </>
                    )}
                    {action === "Delete" && (
                        <>
                            <FormLabel>Course Code</FormLabel>
                            {coursesAsSelectOptions()}
                        </>
                    )}
                    {action === "Edit" && (
                        <>
                            <FormLabel>Course Code</FormLabel>
                            {coursesAsSelectOptions()}
                            <FormLabel>Course Name</FormLabel>
                            <Input name="name" value={selectedCourse?.name} onChange={handleChange} />
                            <FormLabel>Course Description</FormLabel>
                            <Input name="description" value={selectedCourse?.description} onChange={handleChange} />
                            <FormLabel>Course Skills</FormLabel>
                            <HStack wrap="wrap" spacing={4}>
                                {skillsList.map((skill) => (
                                    <Checkbox key={skill} value={skill} isChecked={selectedCourse?.skills?.includes(skill)} onChange={handleCheckboxChange} name="skills">{skill}</Checkbox>
                                ))}
                            </HStack>
                        </>
                    )}
                </FormControl>
                <Button type="submit" colorScheme="red" display="block" mx="auto" mt={4}>Submit</Button>
            </form>
        </>
    );
}

export default EditCourses;