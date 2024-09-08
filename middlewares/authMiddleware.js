import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token || token === "null") {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.user = await User.findById(decode.id).select("-password");
    req.id = decode.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Token verification failed",
      success: false,
    });
  }
};
