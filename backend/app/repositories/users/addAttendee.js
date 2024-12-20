import db from "../../connection";

export const addAttendee = async (eventId, userId) => {
  try {
    const result = await db.query(
      `INSERT INTO event_attendees (event_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [eventId, userId]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23503") {
      throw new Error("Event not found");
    }
    throw error;
  }
};
