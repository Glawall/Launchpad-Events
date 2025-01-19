import * as eventTypeService from "../../services/eventTypes/getAllEventTypes.js";

export const getAllEventTypes = async (req, res, next) => {
  try {
    const eventTypes = await eventTypeService.getAllEventTypes();
    res.status(200).json(eventTypes);
  } catch (error) {
    next(error);
  }
};
