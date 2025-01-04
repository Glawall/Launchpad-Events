import db from "../../connection.js";
import { handleDatabaseError } from "../../middleware/errorHandler.js";

export const createUser = async ({ email, name, role, password_hash }) => {
  try {
    const {
      rows: [user],
    } = await db.query(
      `INSERT INTO users 
        (email, name, role, password_hash, created_at, updated_at)
       VALUES 
        ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, email, name, role, created_at, updated_at`,
      [email, name, role, password_hash]
    );

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  } catch (error) {
    handleDatabaseError(error);
  }
};
