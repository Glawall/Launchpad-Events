import * as eventTypeRepository from "../../repositories/eventTypes/getAllEventTypes.js";

export const getAllEventTypes = async () => {
  const eventTypes = await eventTypeRepository.getAllEventTypes();
  return eventTypes;
};
