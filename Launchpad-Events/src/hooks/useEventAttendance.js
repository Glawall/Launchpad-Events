import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useAttendees } from "./api-hooks";

export default function useEventAttendance(event, onEventUpdate) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addAttendee, deleteAttendee } = useAttendees();

  const attending =
    event?.attendees?.some((attendee) => attendee.id === user?.id) || false;

  const handleAttendance = useCallback(async () => {
    if (!user || !event) return;
    setLoading(true);

    try {
      if (attending) {
        await deleteAttendee(event.id, user.id);
        const updatedEvent = {
          ...event,
          attendees: event.attendees.filter(
            (attendee) => attendee.id !== user.id
          ),
        };
        onEventUpdate(updatedEvent);
      } else {
        await addAttendee(event.id, user.id);
        const updatedEvent = {
          ...event,
          attendees: [...event.attendees, { id: user.id, name: user.name }],
        };
        onEventUpdate(updatedEvent);
      }
    } catch (error) {
      console.error("Attendance action failed:", error);
    } finally {
      setLoading(false);
    }
  }, [user, event, attending, addAttendee, deleteAttendee, onEventUpdate]);

  const removeAttendee = useCallback(
    async (eventId, userId) => {
      try {
        await deleteAttendee(eventId, userId);
        const updatedEvent = {
          ...event,
          attendees: event.attendees.filter(
            (attendee) => attendee.id !== userId
          ),
        };
        onEventUpdate(updatedEvent);
      } catch (error) {
        console.error("Failed to remove attendee:", error);
      }
    },
    [deleteAttendee, event, onEventUpdate]
  );

  return {
    attending,
    loading,
    handleAttendance,
    removeAttendee,
  };
}
