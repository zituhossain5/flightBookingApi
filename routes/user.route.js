import express from "express";
import { check } from "express-validator";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Email is required").isEmail().not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

router.get("/logout", logout);

router.put("/profile/update", authMiddleware, updateProfile);

export default router;
