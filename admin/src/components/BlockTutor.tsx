import { Tutor, tutorService } from "@/services/api";
import { Button, FormControl, FormLabel, Select } from "@chakra-ui/react";
import router from "next/router";
import { useEffect, useState } from "react";

const BlockTutor = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

    const getTutors = async () => {
        const temp = await tutorService.getAllTutors();
        setTutors(temp);
        setSelectedTutor(temp[0]);
    };

    useEffect(() => {
        getTutors();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await tutorService.updateTutorBlocked(selectedTutor?.id || "", !selectedTutor?.blocked);
        router.reload();
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel fontSize="2xl" fontWeight="bold">Update Tutor Blocked Status</FormLabel>
                    <Select onChange={(e) => setSelectedTutor(tutors.find((tutor) => tutor.id === e.target.value) || null)}>
                        {tutors.map((tutor) => (
                            <option value={tutor.id}>{tutor.name}</option>
                        ))}
                    </Select>
                    <Button type="submit" colorScheme="red">{selectedTutor?.blocked ? "Unblock" : "Block"}</Button>
                </FormControl>
            </form>
        </>
    );
}

export default BlockTutor;