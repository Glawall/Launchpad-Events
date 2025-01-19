import db from "../../connection.js";

export const getAllEventTypes = async () => {
  const query = `
    SELECT 
      event_types.*,
      COALESCE(COUNT(events.id), 0) as event_count
    FROM event_types
    LEFT JOIN events ON events.event_type_id = event_types.id
    GROUP BY event_types.id
  `;

  const result = await db.query(query);
  return result.rows;
};
