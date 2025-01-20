import {
  createAuthenticationError,
  createValidationError,
  createAuthorizationError,
} from "./errorHandler.js";

export const checkEvent = (eventData) => {
  const requiredFields = [
    "title",
    "description",
    "date",
    "capacity",
    "location_name",
    "location_address",
    "event_type_id",
    "creator_id",
  ];

  for (const field of requiredFields) {
    if (!eventData[field]) {
      throw createValidationError(`Missing required field: ${field}`);
    }
  }

  if (typeof eventData.capacity !== "number" || eventData.capacity <= 0) {
    throw createValidationError("Capacity must be a positive number");
  }

  if (new Date(eventData.date) < new Date()) {
    throw createValidationError("Event date must be in the future");
  }

  return true;
};

export const checkUserAccess = (
  userRole,
  userId,
  requestedUserId,
  action = "access"
) => {
  if (isNaN(userId) || isNaN(requestedUserId)) {
    throw createValidationError("Invalid user ID");
  }
  if (!userRole || !userId) {
    throw createAuthenticationError("You need to be signed in");
  }

  if (userRole !== "admin" && userId !== requestedUserId) {
    const messages = {
      access: "You can only access your own profile",
      delete: "You can only delete your own profile",
      update: "You can only update your own profile",
    };
    throw createAuthorizationError(messages[action] || messages.access);
  }

  return {
    isAdmin: userRole === "admin",
    userId: userId,
    isOwnProfile: userId === requestedUserId,
  };
};

export const checkPaginationParams = (page, limit) => {
  const parsedPage = page ? parseInt(page) : 1;
  const parsedLimit = limit ? parseInt(limit) : 10;

  if (isNaN(parsedPage)) {
    throw createValidationError("Invalid page number");
  }

  if (parsedPage < 1) {
    throw createValidationError("Page number must be positive");
  }

  if (isNaN(parsedLimit)) {
    throw createValidationError("Invalid limit number");
  }

  if (parsedLimit < 1 || parsedLimit > 100) {
    throw createValidationError("Limit must be between 1 and 100");
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
  };
};

export const checkSortParams = (sort, order) => {
  const validSortFields = ["date", "title", "capacity", "created_at"];
  const validOrders = ["asc", "desc"];

  const sortField = sort || "date";
  const sortOrder = (order || "asc").toLowerCase();

  if (!validSortFields.includes(sortField)) {
    throw createValidationError("Invalid sort field");
  }

  if (!validOrders.includes(sortOrder)) {
    throw createValidationError("Invalid sort order");
  }

  return {
    sort: sortField,
    order: sortOrder,
  };
};

export const checkEventAttendanceIds = (eventId, userId) => {
  if (!eventId || isNaN(eventId)) {
    throw createValidationError("Invalid event ID");
  }
  if (!userId || isNaN(userId)) {
    throw createValidationError("Invalid user ID");
  }

  return {
    eventId: parseInt(eventId),
    userId: parseInt(userId),
  };
};

export const checkEventCapacity = (event, attendees, userId) => {
  const isAttending = attendees.some(
    (attendee) => attendee.user_id === userId || attendee.id === userId
  );
  if (isAttending) {
    throw createValidationError("User is already attending this event");
  }

  if (attendees.length >= event.capacity) {
    throw createValidationError("Event is at full capacity");
  }

  return true;
};

export const checkEventType = (eventTypeData) => {
  const requiredFields = ["name", "description"];

  for (const field of requiredFields) {
    if (!eventTypeData[field]) {
      throw createValidationError(`Missing required field: ${field}`);
    }
  }

  return eventTypeData;
};

export const checkEventTypeId = (typeId) => {
  const parsedTypeId = parseInt(typeId);
  if (isNaN(parsedTypeId) || parsedTypeId < 1) {
    throw createValidationError("Invalid event type ID");
  }
  return parsedTypeId;
};
