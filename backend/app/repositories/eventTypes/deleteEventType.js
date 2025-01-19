import db from "../../connection.js";
import { handleDatabaseError } from "../../middleware/errorHandler.js";

export const deleteEventType = async (id) => {
  try {
    const { rows } = await db.query(
      `DELETE FROM event_types
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
