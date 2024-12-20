import * as adminRepository from "../../../repositories/admin/events/index";
import { checkEvent } from "../../../middleware/checkValidation";

export const createEvent = async (eventData) => {
  checkEvent(eventData);

  const newEvent = await adminRepository.createEvent(eventData);
  return newEvent;
};
