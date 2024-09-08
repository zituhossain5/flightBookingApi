import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
} from "../controller/booking.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/addBooking", authMiddleware, createBooking);
router.get("/user", authMiddleware, getUserBookings);
router.get("/admin", authMiddleware, roleMiddleware(["Admin"]), getAllBookings);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  updateBooking
);
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  deleteBooking
);

// router.post("/cancleBooking/:id", authMiddleware, cancelBooking);
export default router;
