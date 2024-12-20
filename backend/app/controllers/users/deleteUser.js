import * as userService from "../../services/users/index";

export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
