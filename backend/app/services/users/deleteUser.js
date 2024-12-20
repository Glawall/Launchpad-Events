import * as userRepository from "../../repositories/users/index";

export const deleteUser = async (userId) => {
  if (isNaN(userId)) {
    throw createValidationError("Invalid user ID");
  }

  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await userRepository.deleteUser(userId);
};
