import * as adminRepository from "../../repositories/admin/users/index";

export const getUserById = async (userId) => {
  if (isNaN(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await adminRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
