import db from "../../connection.js";
import { handleDatabaseError } from "../../middleware/errorHandler.js";

export const updateEventType = async (id, eventTypeData) => {
  try {
    const { rows } = await db.query(
      `UPDATE event_types
       SET name = $1, 
           description = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, description, created_at, updated_at`,
      [eventTypeData.name, eventTypeData.description, id]
    );

    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
