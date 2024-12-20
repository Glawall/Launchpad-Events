import * as userService from "../../services/users/addAttendee";
import { createValidationError } from "../../middleware/errorHandler";

export const addAttendee = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);

    if (!eventId || isNaN(eventId)) {
      throw createValidationError("Invalid event ID");
    }
    if (!userId || isNaN(userId)) {
      throw createValidationError("Invalid user ID");
    }

    const attendance = await userService.addAttendee(eventId, userId);
    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};
