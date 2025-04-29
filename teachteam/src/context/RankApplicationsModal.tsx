import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, VStack, HStack, Select } from "@chakra-ui/react";
import { useApplications } from "@/context/ApplicationsContext";
import { usersList } from "@/components/UsersList";

const RankApplicationsModal = ({ isOpen, onClose, courseCode }) => {
  const { applications, setApplications } = useApplications();
  const approvedApplications = Array.from(applications.entries())
    .flatMap(([email, roles]) =>
      roles.filter((role) => role.course.code === courseCode && role.status === "Approved").map((role) => ({
        email,
        ...role,
      }))
    );

  const [rankings, setRankings] = useState(() =>
    Array.from({ length: approvedApplications.length }, (_, i) => ({
      rank: i + 1,
      email: null,
    }))
  );

  const handleNameChange = (rank, selectedEmail) => {
    setRankings((prev) =>
      prev.map((item) =>
        item.rank === rank ? { ...item, email: selectedEmail } : item
      )
    );
  };

  const getAvailableOptions = (currentEmail) => {
    const selectedEmails = rankings.map((item) => item.email);
    return approvedApplications.filter(
      (app) =>
        !selectedEmails.includes(app.email) || app.email === currentEmail
    );
  };

  const handleSave = () => {
    setApplications((prevApplications) => {
      const newApplications = new Map(prevApplications);
      rankings.forEach(({ email, rank }) => {
        if (email) {
          const userRoles = newApplications.get(email) || [];
          const updatedRoles = userRoles.map((role) =>
            role.course.code === courseCode ? { ...role, rank } : role
          );
          newApplications.set(email, updatedRoles);
        }
      });
      return newApplications;
    });
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
                        "Unknown"}
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