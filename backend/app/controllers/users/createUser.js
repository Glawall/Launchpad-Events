import * as userService from "../../services/users/index.js";

export const createUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const user = await userService.createUser({
      email,
      name,
      password,
      role: "user",
    });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};
