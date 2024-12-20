import * as adminService from "../../../services/admin/users/index";

export const updateUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    const updatedUser = await adminService.updateUser(userId, role);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
