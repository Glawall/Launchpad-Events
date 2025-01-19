import { checkEventType } from "../../middleware/checkValidation";
import * as eventTypeRepository from "../../repositories/eventTypes";

export const updateEventType = async (id, eventTypeData) => {
  const existingEventType = await eventTypeRepository.getEventTypeById(id);
  if (!existingEventType) {
    throw new Error("Event type not found");
  }
  checkEventType(eventTypeData);
  const updatedEventType = await eventTypeRepository.updateEventType(
    id,
    eventTypeData
  );

  return updatedEventType;
};
