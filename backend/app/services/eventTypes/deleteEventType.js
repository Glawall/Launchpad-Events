import * as eventTypeRepository from "../../repositories/eventTypes";

export const deleteEventType = async (id) => {
  const existingEventType = await eventTypeRepository.getEventTypeById(id);
  if (!existingEventType) {
    throw new Error("Event type not found");
  }

  return await eventTypeRepository.deleteEventType(id);
};
