import db from "../../../connection.js";
import { handleDatabaseError } from "../../../middleware/errorHandler.js";

export const deleteEvent = async (id) => {
  try {
    await db.query(
      `
        DELETE FROM events
        WHERE id = $1
      `,
      [id]
    );
  } catch (error) {
    handleDatabaseError(error);
  }
};
