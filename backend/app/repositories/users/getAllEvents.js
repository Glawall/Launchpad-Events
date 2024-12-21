import db from "../../connection";

export const getAllEvents = async ({
  sort = "date",
  order = "asc",
  page = 1,
  limit = 10,
}) => {
  const offset = (page - 1) * limit;
  const validSortFields = ["date", "title", "capacity", "created_at"];
  const validOrders = ["asc", "desc"];

  const sortField = validSortFields.includes(sort) ? sort : "date";
  const sortOrder = validOrders.includes(order.toLowerCase()) ? order : "asc";

  const queryStr = `
    SELECT 
      e.*,
      et.name as event_type_name,
      u.name as creator_name,
      COUNT(ea.id) as attendee_count,
      COUNT(*) OVER() as total_count
    FROM events e
    LEFT JOIN event_types et ON e.event_type_id = et.id
    LEFT JOIN users u ON e.creator_id = u.id
    LEFT JOIN event_attendees ea ON e.id = ea.event_id
    GROUP BY e.id, et.name, u.name
    ORDER BY e.${sortField} ${sortOrder}
    LIMIT $1 OFFSET $2
  `;

  const result = await db.query(queryStr, [limit, offset]);

  const totalCount = result.rows[0]?.total_count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    events: result.rows,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount: parseInt(totalCount),
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
