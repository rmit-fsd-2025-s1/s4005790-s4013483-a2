import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useUser } from "@/context/UserContext";
import { tutorApi } from "@/services/tutor.api";
import axios from "axios"; // for preference save/load, adjust baseURL if needed

// It is recommended to use the user's real lecturerId for backend submission.
const getLecturerId = (user) => user?.id || user?.lecturerId || 1;

const RankApplicationsModal = ({ isOpen, onClose, courseCode, applications }) => {
  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const toast = useToast();

  // Load preferences on open
  useEffect(() => {
    if (!isOpen || !courseCode || !user) return;
    const fetchPreferences = async () => {
      try {
        // GET preferences for this course/lecturer
        const response = await axios.get(`/api/preferences/${courseCode}/${getLecturerId(user)}`);
        const prefs = response.data;
        if (prefs && prefs.length) {
          // Order applications by preference, add new apps at the end
          const ordered = prefs
            .map((pref) => applications.find((a) => a.id === pref.applicationId))
            .filter(Boolean);
          const extras = applications.filter((a) => !ordered.some((o) => o.id === a.id));
          setRanked([...ordered, ...extras]);
        } else {
          setRanked(applications);
        }
      } catch {
        setRanked(applications);
      }
    };
    fetchPreferences();
  }, [isOpen, courseCode, applications, user]);

  // Drag and drop handler
  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const items = Array.from(ranked);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setRanked(items);
  }, [ranked]);

  // Save preferences to backend
  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("/api/preferences/save", {
        courseCode,
        lecturerId: getLecturerId(user),
        rankings: ranked.map((a, idx) => ({
          applicationId: a.id,
          preference_rank: idx + 1,
        })),
      });
      toast({ title: "Ranking saved", status: "success" });
      onClose();
    } catch (e) {
      toast({ title: "Failed to save rankings", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rank Applications</ModalHeader>
        <ModalBody>
          <Text fontSize="sm" mb={3} color="gray.600">
            Drag cards to set your preference order. Top card is most preferred.
          </Text>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="applications-droppable">
              {(provided) => (
                <VStack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  spacing={3}
                  align="stretch"
                  minH="100px"
                >
                  {ranked.map((app, idx) => (
                    <Draggable key={app.id} draggableId={String(app.id)} index={idx}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          bg={snapshot.isDragging ? "#bee3f8" : "#f7fafc"}
                          borderWidth="1px"
                          borderRadius="md"
                          p={3}
                          boxShadow="sm"
                        >
                          <Text fontWeight="bold" mb={1}>
                            Preference #{idx + 1}
                          </Text>
                          <Text><strong>Name:</strong> {app.name || app.email}</Text>
                          <Text><strong>Role:</strong> {app.roles}</Text>
                          <Text><strong>Email:</strong> {app.email}</Text>
                          <Text><strong>Skills Fulfilled:</strong> {app.skillsFulfilled}</Text>
                          <Text noOfLines={2}><strong>Expression of Interest:</strong> {app.expressionOfInterest}</Text>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </VStack>
              )}
            </Droppable>
          </DragDropContext>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSave} isLoading={loading}>
            Save Ranking
          </Button>
          <Button variant="ghost" onClick={onClose} ml={2}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RankApplicationsModal;