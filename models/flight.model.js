import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  airline: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
});

const Flight = mongoose.model("Flight", flightSchema);
export default Flight;
