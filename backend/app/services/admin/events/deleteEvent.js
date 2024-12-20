import * as adminRepository from "../../../repositories/admin/events/index";
import * as userRepository from "../../../repositories/users/index";

export const deleteEvent = async (eventId) => {
  if (isNaN(eventId)) {
    throw new Error("Invalid event ID");
  }

  const event = await userRepository.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  await adminRepository.deleteEvent(eventId);
};
