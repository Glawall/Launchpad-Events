import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as authRepository from "../../repositories/auth/login";
import {
  createAuthenticationError,
  createValidationError,
} from "../../middleware/errorHandler";

export const login = async (email, password) => {
  if (!email || !password) {
    throw createValidationError("Email and password are required");
  }

  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw createAuthenticationError("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw createAuthenticationError("Invalid email or password");
  }

  const userData = {
    email: user.email,
    id: user.id,
    role: user.role,
    name: user.name,
  };

  return jwt.sign(userData, process.env.JWT_SECRET || "SECRET_KEY", {
    expiresIn: "1h",
  });
};
