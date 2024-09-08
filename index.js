import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import userRoute from "./routes/user.route.js";
import flightRoute from "./routes/flight.route.js";
import bookihgRoute from "./routes/booking.route.js";
import connectDB from "./utils/db.js";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "https://flight-bookingfrontend.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://flight-bookingfrontend.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  next();
});

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/user", userRoute);
app.use("/api/flight", flightRoute);
app.use("/api/booking", bookihgRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
