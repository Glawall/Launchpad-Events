import { checkUserAccess } from "./checkValidation";

export const checkAuth = (req, res, next) => {
  const userRole = req.get("user-role");

  if (!userRole) {
    return res.status(401).json({ message: "You need to be signed in" });
  }

  req.userRole = userRole;
  next();
};

export const checkAdmin = [
  checkAuth,
  (req, res, next) => {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "You need to be an admin to carry out this action" });
    }
    next();
  },
];

export const checkUser = [
  checkAuth,
  (req, res, next) => {
    try {
      const userRole = req.get("user-role");
      const userId = parseInt(req.get("user-id"));

      if (req.params.userId) {
        const requestedUserId = parseInt(req.params.userId);

        if (requestedUserId !== userId && userRole !== "admin") {
          return res.status(403).json({
            message: "You can only manage your own attendance",
          });
        }
      } else if (req.params.id) {
        const requestedUserId = parseInt(req.params.id);
        req.userAccess = checkUserAccess(userRole, userId, requestedUserId);
      }

      next();
    } catch (error) {
      next(error);
    }
  },
];
