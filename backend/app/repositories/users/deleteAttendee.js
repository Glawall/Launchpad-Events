import db from "../../connection";

export const deleteAttendee = async (eventId, userId) => {
  try {
    const result = await db.query(
      `DELETE FROM event_attendees 
       WHERE event_id = $1 AND user_id = $2
       RETURNING *`,
      [eventId, userId]
    );

    if (!result.rows.length) {
      throw new Error("User is not attending this event");
    }

    return result.rows[0];
  } catch (error) {
    if (error.code === "23503") {
      throw new Error("Event not found");
    }
    throw error;
  }
};
