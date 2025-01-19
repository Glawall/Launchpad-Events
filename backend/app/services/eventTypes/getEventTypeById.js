import * as eventTypeRepository from "../../repositories/eventTypes";

export const getEventTypeById = async (id) => {
  const eventType = await eventTypeRepository.getEventTypeById(id);

  if (!eventType) {
    throw new Error("Event type not found");
  }

  return eventType;
};
