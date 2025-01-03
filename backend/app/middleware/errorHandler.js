export const createDatabaseError = (message, code) => {
  const error = new Error(message);
  error.name = "DatabaseError";
  error.code = code;
  return error;
};

export const createAuthenticationError = (message) => {
  const error = new Error(message);
  error.name = "AuthenticationError";
  return error;
};

export const createAuthorizationError = (message) => {
  const error = new Error(message);
  error.name = "AuthorizationError";
  return error;
};

export const createValidationError = (message) => {
  const error = new Error(message);
  error.name = "ValidationError";
  return error;
};

export const handleDatabaseError = (error) => {
  const errorCodes = {
    23505: "Duplicate entry found",
    "42P01": "Table not found",
    23503: "Foreign key violation",
    42703: "Column not found",
    "22P02": "Invalid data type",
  };

  if (error.code && errorCodes[error.code]) {
    throw createDatabaseError(errorCodes[error.code], error.code);
  }

  throw createDatabaseError("Database error: " + error.message);
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "AuthenticationError") {
    return res.status(401).json({ message: err.message });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "DatabaseError") {
    return res.status(500).json({ message: err.message });
  }

  if (err.name === "AuthorizationError") {
    return res.status(403).json({ message: err.message });
  }

  if (err.message === "Event not found") {
    return res.status(404).json({ message: "Event not found" });
  }
  if (err.message === "Event is at full capacity") {
    return res.status(400).json({ message: "Event is at full capacity" });
  }
  if (err.message === "User is already attending this event") {
    return res
      .status(400)
      .json({ message: "User is already attending this event" });
  }

  if (err.message === "User not found") {
    return res.status(404).json({ message: "User not found" });
  }

  if (err.message === "Invalid event ID") {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  if (err.message === "Invalid user ID") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (err.message === "You need to be signed in") {
    return res.status(401).json({ message: "You need to be signed in" });
  }

  if (err.message === "You need to be an admin to carry out this action") {
    return res
      .status(403)
      .json({ message: "You need to be an admin to carry out this action" });
  }

  if (err.message === "You can only delete your own profile") {
    return res
      .status(403)
      .json({ message: "You can only delete your own profile" });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
