import * as adminRepository from "../../../repositories/admin/events/index";
import * as userRepository from "../../../repositories/users/index";
import { checkEvent } from "../../../middleware/checkValidation";

export const updateEvent = async (eventId, eventData) => {
  const existingEvent = await userRepository.getEventById(eventId);
  if (!existingEvent) {
    throw new Error("Event not found");
  }
  checkEvent(eventData);

  const updatedEvent = await adminRepository.updateEvent(eventId, eventData);
  return updatedEvent;
};
