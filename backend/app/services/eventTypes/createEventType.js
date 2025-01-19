import { checkEventType } from "../../middleware/checkValidation";
import * as eventTypeRepository from "../../repositories/eventTypes/index";

export const createEventType = async (eventTypeData) => {
  checkEventType(eventTypeData);
  const newEventType = await eventTypeRepository.createEventType(eventTypeData);
  return newEventType;
};
