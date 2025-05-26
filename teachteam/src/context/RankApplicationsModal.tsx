import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Text, VStack, HStack, Select
} from "@chakra-ui/react";
import { useUsersLists } from "@/context/UsersListsContext";
import { tutorApi } from "@/services/tutor.api";

const RankApplicationsModal = ({ isOpen, onClose, courseCode }) => {
  const [applications, setApplications] = useState([]);
  const { usersList } = useUsersLists();
  const [rankings, setRankings] = useState([]);

  // Fetch applications for the course when modal opens or courseCode changes
  useEffect(() => {
    if (isOpen && courseCode) {
      tutorApi.getApplicationsByCourse(courseCode).then((apps) => {
        // Filter for approved applications only
        const approved = apps.filter((app) => app.outcome === "Approved");
        setApplications(approved);
        // Reset rankings when applications change
        setRankings(
          approved.map((app, i) => ({
            rank: i + 1,
            email: null,
          }))
        );
      });
    }
  }, [isOpen, courseCode]);

  // Helper: Get available options for each rank (cannot select same candidate twice)
  const getAvailableOptions = (currentEmail) => {
    const selectedEmails = rankings.map((item) => item.email);
    return applications.filter(
      (app) =>
        !selectedEmails.includes(app.email) || app.email === currentEmail
    );
  };

  // Handle selection change
  const handleNameChange = (rank, selectedEmail) => {
    setRankings((prev) =>
      prev.map((item) =>
        item.rank === rank ? { ...item, email: selectedEmail } : item
      )
    );
  };

  // Save rankings (implement actual saving logic as needed)
  const handleSave = () => {
    // You need to POST/PATCH rankings to backend if you want them stored
    // Here you can call a backend endpoint or update local state
    // Example: tutorApi.saveRankings(courseCode, rankings)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rank Applications</ModalHeader>
        <ModalBody>
          <VStack align="start" spacing={4}>
            {rankings.map((ranking) => (
              <HStack key={ranking.rank} justify="space-between" w="100%">
                <Text>Rank {ranking.rank}</Text>
                <Select
                  placeholder="Select a name"
                  value={ranking.email || ""}
                  onChange={(e) => handleNameChange(ranking.rank, e.target.value)}
                  width="200px"
                >
                  {getAvailableOptions(ranking.email).map((app) => (
                    <option key={app.email} value={app.email}>
                      {usersList.find((user) => user.email === app.email)?.name ||
                        app.email}
                    </option>
                  ))}
                </Select>
              </HStack>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isDisabled={rankings.some((item) => !item.email)}
          >
            Save Rankings
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RankApplicationsModal;