import * as adminRepository from "../../../repositories/admin/users/index";
import * as userRepository from "../../../repositories/users/index";
import { createValidationError } from "../../../middleware/errorHandler";

const VALID_ROLES = ["admin", "user"];

export const updateUser = async (userId, role) => {
  if (isNaN(userId)) {
    throw createValidationError("Invalid user ID");
  }

  if (!VALID_ROLES.includes(role)) {
    throw createValidationError(
      'Invalid role. Must be either "admin" or "user"'
    );
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await adminRepository.updateUser(userId, role);
};
