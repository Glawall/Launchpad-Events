import {
  createAuthenticationError,
  createValidationError,
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
    throw createAuthenticationError(messages[action] || messages.access);
  }

  return {
    isAdmin: userRole === "admin",
    userId: userId,
    isOwnProfile: userId === requestedUserId,
  };
};
