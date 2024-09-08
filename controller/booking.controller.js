import {
  errorHandler,
  responseHandler,
} from "../middlewares/responseHandler.js";
import Booking from "../models/Booking.model.js";
import Flight from "../models/flight.model.js";
import nodemailer from "nodemailer";

// export const createBooking = async (req, res) => {
//   try {
//     const { flightId, numberOfSeats } = req.body;
//     const userId = req.user.id;
//     if (!flightId || !numberOfSeats) {
//       return responseHandler(res, 400, "All fields are required", false);
//     }
//     const flight = await Flight.findById(flightId);
//     if (!flight) {
//       return responseHandler(res, 404, "Flight not found", false);
//     }
//     if (flight.availableSeats < numberOfSeats) {
//       return responseHandler(res, 400, "Not enough seats available", false);
//     }
//     const totalPrice = flight.price * numberOfSeats;
//     const booking = new Booking({
//       userId,
//       flightId,
//       numberOfSeats,
//       totalPrice,
//       bookingStatus: "confirmed",
//     });
//     flight.availableSeats -= numberOfSeats;

//     await booking.save();
//     await flight.save();

//     return responseHandler(res, 201, "Booking created successfully", true, {
//       booking,
//     });
//   } catch (error) {
//     return errorHandler(res, error);
//   }
// };

const sendBookingConfirmationEmail = async (
  userEmail,
  bookingDetails,
  flightDetails
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Flight Booking Confirmation",
    text: `
      Your booking has been confirmed!
      
      Booking Details:
      - Flight: ${flightDetails.flightNumber}
      - From: ${flightDetails.origin} to ${flightDetails.destination}
      - Date & Time: ${new Date(flightDetails.date).toDateString()} - ${
      flightDetails.time
    }
      - Seat Class: ${bookingDetails.seatClass}
      - Number of Seats: ${bookingDetails.numberOfSeats}
      - Total Price: ${bookingDetails.totalPrice} BDT
      
      Thank you for choosing us. Have a great trip!
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const createBooking = async (req, res) => {
  try {
    const { flightId, numberOfSeats, seatClass = "Economy" } = req.body;
    const userId = req.user.id;

    if (!numberOfSeats || !seatClass) {
      return responseHandler(res, 400, "All fields are required", false);
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return responseHandler(res, 404, "Flight not found", false);
    }
    if (flight.availableSeats < numberOfSeats) {
      return responseHandler(res, 400, "Not enough seats available", false);
    }

    // Determine price multiplier based on seat class
    let priceMultiplier = 1; // Default multiplier for Economy
    if (seatClass === "Business") priceMultiplier = 1.5;
    if (seatClass === "First Class") priceMultiplier = 2;

    // Calculate total price
    const totalPrice = flight.price * numberOfSeats * priceMultiplier;

    // const cancellationWindow = 24 * 60 * 60 * 1000;
    // const cancellationAllowedUntil = new Date(
    //   flight.date.getTime() - cancellationWindow
    // );

    const booking = new Booking({
      userId,
      flightId,
      numberOfSeats,
      seatClass,
      totalPrice,
      bookingStatus: "confirmed",
      // cancellationAllowedUntil,
    });

    flight.availableSeats -= numberOfSeats;
    await booking.save();
    await flight.save();

    // Send booking confirmation email
    await sendBookingConfirmationEmail(req.user.email, booking, flight);

    return responseHandler(res, 201, "Booking created successfully", true, {
      booking,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("flightId userId");
    return responseHandler(res, 200, "Bookings fetched successfully", true, {
      bookings,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authentication middleware
    console.log("zid", userId);
    const bookings = await Booking.find({ userId }).populate("flightId");

    if (!bookings) {
      return responseHandler(res, 404, "Bookings not found", false);
    }

    return responseHandler(res, 200, "Bookings fetched successfully", true, {
      bookings,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!booking) {
      return responseHandler(res, 404, "Booking not found", false);
    }
    return responseHandler(res, 200, "Booking updated successfully", true, {
      booking,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return responseHandler(res, 404, "Booking not found", false);
    }
    return responseHandler(res, 200, "Booking deleted successfully", true, {
      booking,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

// export const cancelBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const userId = req.user.id;

//     const booking = await Booking.findOne({ _id: bookingId, userId }).populate(
//       "flightId"
//     );
//     if (!booking) {
//       return responseHandler(res, 404, "Booking not found", false);
//     }

//     // Check if the booking is within the cancellation window
//     const currentDateTime = new Date();
//     if (currentDateTime > booking.cancellationAllowedUntil) {
//       return responseHandler(
//         res,
//         400,
//         "Cancellation time frame has passed",
//         false
//       );
//     }

//     // Update booking status
//     booking.bookingStatus = "cancelled";
//     booking.flightId.availableSeats += booking.numberOfSeats; // Refund seats
//     await booking.save();
//     await booking.flightId.save();

//     return responseHandler(res, 200, "Booking cancelled successfully", true);
//   } catch (error) {
//     return errorHandler(res, error);
//   }
// };
