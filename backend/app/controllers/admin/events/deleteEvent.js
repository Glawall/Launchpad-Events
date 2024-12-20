import * as adminService from "../../../services/admin/events/index";

export const deleteEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    await adminService.deleteEvent(eventId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
