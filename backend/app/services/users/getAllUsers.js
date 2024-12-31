import * as adminRepository from "../../repositories/users/index";

export const getAllUsers = async () => {
  const users = await adminRepository.getAllUsers();
  return users;
};
