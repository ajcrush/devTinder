const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookie_parser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(cookie_parser());
app.use(express.json());
app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Datatbase connection established ");
    app.listen(7777, () => {
      console.log("Server is working");
    });
  })
  .catch((err) => {
    console.error("Database connection not established");
  });
