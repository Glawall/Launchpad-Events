import * as adminService from "../../../services/admin/events/index";

export const createEvent = async (req, res, next) => {
  try {
    const newEvent = await adminService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};
