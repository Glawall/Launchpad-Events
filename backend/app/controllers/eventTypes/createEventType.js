import * as eventTypeService from "../../services/eventTypes/index";

export const createEventType = async (req, res, next) => {
  try {
    const eventType = await eventTypeService.createEventType(req.body);
    res.status(201).json(eventType);
  } catch (error) {
    next(error);
  }
};
