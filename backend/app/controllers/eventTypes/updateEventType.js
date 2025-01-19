import * as eventTypeService from "../../services/eventTypes";
import { createValidationError } from "../../middleware/errorHandler.js";

export const updateEventType = async (req, res, next) => {
  try {
    const eventTypeId = parseInt(req.params.id);

    if (isNaN(eventTypeId)) {
      throw createValidationError("Invalid event type ID");
    }

    const updatedEventType = await eventTypeService.updateEventType(
      eventTypeId,
      req.body
    );
    res.status(200).json(updatedEventType);
  } catch (error) {
    if (error.message === "Event type not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
