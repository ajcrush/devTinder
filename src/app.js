const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookie_parser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const cors = require("cors");
require("dotenv").config();
require("./utils/cronJobs");
// CORS Setup - Ensure it is applied before routes
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed methods
    credentials: true, // Allow cookies and credentials
  })
);

// Parse cookies and JSON bodies
app.use(cookie_parser());
app.use(express.json());

// Define routes
app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

// Preflight (OPTIONS) handling for CORS if needed
app.options("*", cors()); // This ensures that the server responds to OPTIONS requests

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(process.env.PORT, () => {
      console.log("Server is working");
    });
  })
  .catch((err) => {
    console.error("Database connection not established", err);
  });
