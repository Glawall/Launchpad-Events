import db from "../../connection.js";
import { handleDatabaseError } from "../../middleware/errorHandler.js";

export const deleteUser = async (id) => {
  try {
    await db.query(
      `
        DELETE FROM users
        WHERE id = $1
      `,
      [id]
    );
  } catch (error) {
    handleDatabaseError(error);
  }
};
