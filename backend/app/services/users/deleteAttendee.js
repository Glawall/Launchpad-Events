import * as userRepository from "../../repositories/users/index";
import { createValidationError } from "../../middleware/errorHandler";

export const deleteAttendee = async (eventId, userId) => {
  const event = await userRepository.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const isAttending = event.attendees.some(
    (attendee) => attendee.id === userId
  );
  if (!isAttending) {
    throw createValidationError("User is not attending this event");
  }

  return await userRepository.deleteAttendee(eventId, userId);
};
