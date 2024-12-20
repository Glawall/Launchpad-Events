import * as adminService from "../../../services/admin/users/index";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
