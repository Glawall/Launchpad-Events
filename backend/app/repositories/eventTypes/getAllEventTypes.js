import db from "../../connection.js";

export const getAllEventTypes = async () => {
  const query = `
    SELECT 
      id,
      name,
      created_at,
      updated_at
    FROM event_types
    ORDER BY name ASC
  `;

  const result = await db.query(query);
  return result.rows;
};
