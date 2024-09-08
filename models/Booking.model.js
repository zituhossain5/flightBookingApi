import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    numberOfSeats: { type: Number, required: true },
    seatClass: {
      type: String,
      enum: ["Economy", "Business", "First Class"], // Seat class enum
      default: "Economy",
      required: true,
    },
    totalPrice: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    // cancellationAllowedUntil: { type: Date },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
