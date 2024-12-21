import * as userService from "../../services/users/deleteAttendee";
import {
  checkEventAttendanceIds,
  checkUserAccess,
} from "../../middleware/checkValidation";

export const deleteAttendee = async (req, res, next) => {
  try {
    const { eventId, userId } = checkEventAttendanceIds(
      req.params.eventId,
      req.params.userId
    );

    const requestingUserId = parseInt(req.get("user-id"));
    const userRole = req.get("user-role");

    checkUserAccess(userRole, requestingUserId, userId, "attend");

    await userService.deleteAttendee(eventId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
