import db from "../../connection.js";
import { handleDatabaseError } from "../../middleware/errorHandler.js";

export const getEventTypeById = async (id) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, description, created_at, updated_at
       FROM event_types
       WHERE id = $1`,
      [id]
    );
    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
