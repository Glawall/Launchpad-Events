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
        .json({ message: "Only an admin can access this information" });
    }
    next();
  },
];
