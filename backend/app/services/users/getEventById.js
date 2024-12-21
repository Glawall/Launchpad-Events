import * as eventRepository from "../../repositories/users/index";

export const getEventById = async (eventId) => {
  if (isNaN(eventId)) {
    throw new Error("Invalid event ID");
  }

  const event = await eventRepository.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};
