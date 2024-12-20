import * as adminService from "../../../services/admin/events/index";

export const updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const updatedEvent = await adminService.updateEvent(eventId, req.body);
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
};
