import * as userRepository from "../../repositories/users/index";

export const getEventById = async (eventId) => {
  if (isNaN(eventId)) {
    throw new Error("Invalid event ID");
  }

  const event = await userRepository.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};
