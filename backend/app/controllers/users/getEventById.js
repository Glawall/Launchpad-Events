import * as userService from "../../services/users/index";

export const getEventById = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await userService.getEventById(eventId);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};
