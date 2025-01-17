"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUserAccess = exports.checkSortParams = exports.checkPaginationParams = exports.checkEventCapacity = exports.checkEventAttendanceIds = exports.checkEvent = void 0;
var _errorHandler = require("./errorHandler.js");
const checkEvent = eventData => {
  const requiredFields = ["title", "description", "date", "capacity", "location_name", "location_address", "event_type_id", "creator_id"];
  for (const field of requiredFields) {
    if (!eventData[field]) {
      throw (0, _errorHandler.createValidationError)(`Missing required field: ${field}`);
    }
  }
  if (typeof eventData.capacity !== "number" || eventData.capacity <= 0) {
    throw (0, _errorHandler.createValidationError)("Capacity must be a positive number");
  }
  if (new Date(eventData.date) < new Date()) {
    throw (0, _errorHandler.createValidationError)("Event date must be in the future");
  }
  return true;
};
exports.checkEvent = checkEvent;
const checkUserAccess = (userRole, userId, requestedUserId, action = "access") => {
  if (isNaN(userId) || isNaN(requestedUserId)) {
    throw (0, _errorHandler.createValidationError)("Invalid user ID");
  }
  if (!userRole || !userId) {
    throw (0, _errorHandler.createAuthenticationError)("You need to be signed in");
  }
  if (userRole !== "admin" && userId !== requestedUserId) {
    const messages = {
      access: "You can only access your own profile",
      delete: "You can only delete your own profile",
      update: "You can only update your own profile"
    };
    throw (0, _errorHandler.createAuthorizationError)(messages[action] || messages.access);
  }
  return {
    isAdmin: userRole === "admin",
    userId: userId,
    isOwnProfile: userId === requestedUserId
  };
};
exports.checkUserAccess = checkUserAccess;
const checkPaginationParams = (page, limit) => {
  const parsedPage = page ? parseInt(page) : 1;
  const parsedLimit = limit ? parseInt(limit) : 10;
  if (isNaN(parsedPage)) {
    throw (0, _errorHandler.createValidationError)("Invalid page number");
  }
  if (parsedPage < 1) {
    throw (0, _errorHandler.createValidationError)("Page number must be positive");
  }
  if (isNaN(parsedLimit)) {
    throw (0, _errorHandler.createValidationError)("Invalid limit number");
  }
  if (parsedLimit < 1 || parsedLimit > 100) {
    throw (0, _errorHandler.createValidationError)("Limit must be between 1 and 100");
  }
  return {
    page: parsedPage,
    limit: parsedLimit
  };
};
exports.checkPaginationParams = checkPaginationParams;
const checkSortParams = (sort, order) => {
  const validSortFields = ["date", "title", "capacity", "created_at"];
  const validOrders = ["asc", "desc"];
  const sortField = sort || "date";
  const sortOrder = (order || "asc").toLowerCase();
  if (!validSortFields.includes(sortField)) {
    throw (0, _errorHandler.createValidationError)("Invalid sort field");
  }
  if (!validOrders.includes(sortOrder)) {
    throw (0, _errorHandler.createValidationError)("Invalid sort order");
  }
  return {
    sort: sortField,
    order: sortOrder
  };
};
exports.checkSortParams = checkSortParams;
const checkEventAttendanceIds = (eventId, userId) => {
  if (!eventId || isNaN(eventId)) {
    throw (0, _errorHandler.createValidationError)("Invalid event ID");
  }
  if (!userId || isNaN(userId)) {
    throw (0, _errorHandler.createValidationError)("Invalid user ID");
  }
  return {
    eventId: parseInt(eventId),
    userId: parseInt(userId)
  };
};
exports.checkEventAttendanceIds = checkEventAttendanceIds;
const checkEventCapacity = (event, attendees, userId) => {
  const isAttending = attendees.some(attendee => attendee.user_id === userId || attendee.id === userId);
  if (isAttending) {
    throw (0, _errorHandler.createValidationError)("User is already attending this event");
  }
  if (attendees.length >= event.capacity) {
    throw (0, _errorHandler.createValidationError)("Event is at full capacity");
  }
  return true;
};
exports.checkEventCapacity = checkEventCapacity;