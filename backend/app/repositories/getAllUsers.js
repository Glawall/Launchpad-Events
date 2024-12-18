import db from "../connection.js";
import { handleDatabaseError } from "../middleware/errorHandler.js";

export const getAllUsers = async () => {
  try {
    const { rows } = await db.query(`
        SELECT 
          id,
          email,
          name,
          role,
          created_at,
          updated_at
        FROM users
        ORDER BY created_at DESC
      `);

    if (!rows) {
      throw new Error("No users found");
    }

    return rows;
  } catch (error) {
    handleDatabaseError(error);
  }
};
