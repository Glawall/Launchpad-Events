import db from "../../connection.js";
import { handleDatabaseError } from "../../middleware/errorHandler.js";

export const getUserById = async (id) => {
  try {
    const { rows } = await db.query(
      `
        SELECT 
          id,
          name,
          email,
          role,
          created_at,
          updated_at
        FROM users 
        WHERE id = $1
      `,
      [id]
    );
    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
