import * as userRepository from "../../repositories/users/index";
import bcrypt from "bcrypt";
import {
  createValidationError,
  createDatabaseError,
} from "../../middleware/errorHandler.js";

export const createUser = async (userData) => {
  if (!userData.email || !userData.name || !userData.password) {
    throw createValidationError("Email, name, and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw createValidationError("Invalid email format");
  }

  const existingUsers = await userRepository.getAllUsers();
  const userExists = existingUsers.some(
    (user) => user.email === userData.email
  );

  if (userExists) {
    throw createDatabaseError("Duplicate entry found", "23505");
  }

  const password_hash = await bcrypt.hash(userData.password, 10);

  return userRepository.createUser({
    email: userData.email,
    name: userData.name,
    role: "user",
    password_hash,
  });
};
