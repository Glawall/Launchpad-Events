import db from "../../../connection.js";
import { handleDatabaseError } from "../../../middleware/errorHandler.js";

export const updateEvent = async (id, eventData) => {
  try {
    const { rows } = await db.query(
      `
        UPDATE events SET
          title = $1,
          description = $2,
          date = $3,
          end_date = $4,
          capacity = $5,
          location_name = $6,
          location_address = $7,
          event_type_id = $8,
          creator_id = $9,
          status = $10,
          timezone = $11,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
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
        id,
      ]
    );

    return rows[0];
  } catch (error) {
    handleDatabaseError(error);
  }
};
