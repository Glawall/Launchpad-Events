import * as userService from "../../services/users/addAttendee";
import {
  checkEventAttendanceIds,
  checkUserAccess,
} from "../../middleware/checkValidation";

export const addAttendee = async (req, res, next) => {
  try {
    const { eventId, userId } = checkEventAttendanceIds(
      req.params.eventId,
      req.params.userId
    );

    const requestingUserId = parseInt(req.get("user-id"));
    const userRole = req.get("user-role");

    checkUserAccess(userRole, requestingUserId, userId, "attend");

    const attendance = await userService.addAttendee(eventId, userId);
    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};
