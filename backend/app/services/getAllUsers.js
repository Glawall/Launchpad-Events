import * as userRepository from "../repositories/index";

export const getAllUsers = async () => {
  const users = await userRepository.getAllUsers();
  return users;
};
