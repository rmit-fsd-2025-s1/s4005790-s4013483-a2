import { useEffect, useState } from "react";
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, VStack } from "@chakra-ui/react";
import { tutorApi } from "@/services/tutor.api";
import { useUser } from "@/context/UserContext";
import { Notification } from "@/components/NotificationClass";

export default function TutorNotifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.email) {
        const notifs = await tutorApi.getNotifications(user.email);
        setNotifications(notifs);
      }
    };
    fetchNotifications();
  }, [user?.email]);

  const handleClose = async (id: number) => {
    await tutorApi.markNotificationRead(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <VStack spacing={4} align="stretch" mb={6}>
      {notifications.map((notif) => (
        <Alert status="success" variant="left-accent" key={notif.id} borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Application Approved!</AlertTitle>
            <AlertDescription whiteSpace="pre-line">{notif.message}</AlertDescription>
          </Box>
          <CloseButton onClick={() => handleClose(notif.id)} position="absolute" right="8px" top="8px" />
        </Alert>
      ))}
    </VStack>
  );
}