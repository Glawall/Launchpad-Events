import db from "../../../connection.js";
import { handleDatabaseError } from "../../../middleware/errorHandler.js";

export const createEvent = async (eventData) => {
  try {
    const { rows } = await db.query(
      `
      INSERT INTO events (
        title,
        description,
        date,
        end_date,
        capacity,
        location_name,
        location_address,
        event_type_id,
        creator_id,
        status,
        timezone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
      [
        eventData.title,
        eventData.description,
        eventData.date,
        eventData.end_date,
        eventData.capacity,
        eventData.location_name,
        eventData.location_address,
        eventData.event_type_id,
        eventData.creator_id,
        eventData.status || "upcoming",
        eventData.timezone || "Europe/London",
      ]
    );

    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
