import * as userRepository from "../../repositories/users/index";
import { createValidationError } from "../../middleware/errorHandler";

export const addAttendee = async (eventId, userId) => {
  if (!eventId || isNaN(eventId)) {
    throw createValidationError("Invalid event ID");
  }

  const event = await userRepository.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const isAttending = event.attendees.some(
    (attendee) => attendee.id === userId
  );
  if (isAttending) {
    throw createValidationError("User is already attending this event");
  }

  if (event.attendees.length >= event.capacity) {
    throw createValidationError("Event is at full capacity");
  }

  return await userRepository.addAttendee(eventId, userId);
};
