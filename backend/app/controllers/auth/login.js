import * as authService from "../../services/auth/login";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};
