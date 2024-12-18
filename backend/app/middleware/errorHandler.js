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

  if (err.name === "DatabaseError") {
    return res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  if (err.name === "AuthenticationError") {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
