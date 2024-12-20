import * as adminService from "../../services/users/index";

export const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await adminService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
