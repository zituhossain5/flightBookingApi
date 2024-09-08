export const roleMiddleware = (roles) => async (req, res, next) => {
  try {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
