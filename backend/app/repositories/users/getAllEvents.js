import db from "../../connection";

export const getAllEvents = async ({
  sort = "date",
  order = "asc",
  page = 1,
  limit = 10,
  type_id,
}) => {
  const offset = (page - 1) * limit;
  const validSortFields = ["date", "title", "capacity", "created_at"];
  const validOrders = ["asc", "desc"];

  const sortField = validSortFields.includes(sort) ? sort : "date";
  const sortOrder = validOrders.includes(order.toLowerCase()) ? order : "asc";

  let queryParams = [limit, offset];
  let typeFilter = "";

  if (type_id) {
    typeFilter = "WHERE event_type_id = $3";
    queryParams.push(type_id);
  }

  const eventsQueryStr = `
    SELECT 
      events.*,
      event_types.name as event_type_name,
      users.name as creator_name,
      COUNT(*) OVER() as total_count
    FROM events
    LEFT JOIN event_types ON events.event_type_id = event_types.id
    LEFT JOIN users ON events.creator_id = users.id
    ${typeFilter}
    ORDER BY events.${sortField} ${sortOrder}
    LIMIT $1 OFFSET $2
  `;

  const result = await db.query(eventsQueryStr, queryParams);

  const eventIds = result.rows.map((event) => event.id);
  const { rows: allAttendees } = await db.query(
    `
    SELECT 
      event_id,
      users.id,
      users.name
    FROM event_attendees
    JOIN users ON event_attendees.user_id = users.id
    WHERE event_id = ANY($1)
    ORDER BY event_attendees.created_at ASC
  `,
    [eventIds]
  );

  const eventsWithAttendees = result.rows.map((event) => ({
    ...event,
    attendees:
      allAttendees.filter((attendee) => attendee.event_id === event.id) || [],
  }));

  const totalCount = result.rows[0]?.total_count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    events: eventsWithAttendees,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount: parseInt(totalCount),
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
