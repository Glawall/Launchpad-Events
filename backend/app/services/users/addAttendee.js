import * as userRepository from "../../repositories/users/index";
import { checkEventCapacity } from "../../middleware/checkValidation";

export const addAttendee = async (eventId, userId) => {
  const event = await userRepository.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  checkEventCapacity(event, event.attendees, userId);

  return await userRepository.addAttendee(eventId, userId);
};
