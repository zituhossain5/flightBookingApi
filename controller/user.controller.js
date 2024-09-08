import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  errorHandler,
  responseHandler,
} from "../middlewares/responseHandler.js";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return responseHandler(res, 400, errors.array()[0].msg, false);
  try {
    const { username, email, phoneNumber, password } = req.body;
    if (!username || !email || !phoneNumber || !password) {
      responseHandler(res, 400, "All fields are required", false);
    }
    let user = await User.findOne({ email });
    if (user) {
      responseHandler(res, 400, "User already exists", false);
    }
    user = new User({ username, email, phoneNumber, password });
    await user.save();
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return responseHandler(res, 201, "User created successfully", true, {
      user,
      token,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return responseHandler(res, 400, errors.array()[0].msg, false);
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return responseHandler(res, 400, "All fields are required", false);
    const user = await User.findOne({ email });
    if (!user) return responseHandler(res, 400, "User not found", false);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return responseHandler(res, 400, "Invalid credentials", false);

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return responseHandler(res, 200, "Login successful", true, { user, token });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;

    const userId = req.id;
    let user = await User.findById(userId);
    console.log("zuser", user);
    if (!user) {
      return responseHandler(res, 404, "User not found", false);
    }

    // updating data
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return responseHandler(res, 200, "Profile updated successfully", true, {
      user,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};
