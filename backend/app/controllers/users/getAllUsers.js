import * as userService from "../../services/users/index";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
