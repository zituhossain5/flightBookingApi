import express from "express";
import {
  getAllFlights,
  getFlightById,
  searchFlights,
  addFlight,
  updateFlight,
  deleteFlight,
} from "../controller/flight.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/getFlights", getAllFlights);
router.get("/search", searchFlights);
router.get("/:id", getFlightById);
router.post("/addFlight", authMiddleware, roleMiddleware(["Admin"]), addFlight);
router.put("/:id", authMiddleware, roleMiddleware(["Admin"]), updateFlight);
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), deleteFlight);

export default router;
