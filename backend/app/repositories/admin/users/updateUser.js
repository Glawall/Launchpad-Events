import db from "../../../connection.js";
import { handleDatabaseError } from "../../../middleware/errorHandler.js";

export const updateUser = async (id, role) => {
  try {
    const { rows } = await db.query(
      `
        UPDATE users 
        SET role = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `,
      [role, id]
    );
    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
