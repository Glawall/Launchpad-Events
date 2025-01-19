import db from "../../connection.js";
import { handleDatabaseError } from "../../middleware/errorHandler.js";

export const createEventType = async (eventTypeData) => {
  try {
    const { rows } = await db.query(
      `INSERT INTO event_types (name, description)
       VALUES ($1, $2)
       RETURNING id, name, description, created_at, updated_at`,
      [eventTypeData.name, eventTypeData.description]
    );
    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
