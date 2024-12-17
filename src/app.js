const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./config/models/user");
const { userValidation, loginValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookie_parser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(cookie_parser());
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    userValidation(req);
    const { emailId, password, firstName, lastName } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const user = new User({
      emailId,
      firstName,
      lastName,
      password: passHash,
    });
    await user.save();
    res.send("User Add Successfully");
  } catch (err) {
    res.status(500).send(`Error adding user : ${err.message}`);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    loginValidation(emailId);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid crendentials");
    }
    const isPass = await user.validatePassword(password);
    if (isPass) {
      const jwtToken = await user.generateAuthToken();
      res.cookie("token", jwtToken);
      res.send("Login successful");
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (err) {
    res.status(500).send(`Error : ${err.message}`);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).send(`Error : ${err.message}`);
  }
});
app.post("/sendConnection", userAuth, async (req, res, next) => {
  try {
    const user = req.user;

    res.send(`${user.firstName} is sending connection request`);
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});
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
