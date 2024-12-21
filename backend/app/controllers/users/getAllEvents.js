import * as eventService from "../../services/users/getAllEvents";

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents(req.query);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};
