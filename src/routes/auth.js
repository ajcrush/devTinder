const express = require("express");
const { userValidation, loginValidation } = require("../utils/validation");
const User = require("../config/models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
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
    const newUser = await user.save();
    const jwtToken = await newUser.generateAuthToken();
    res.cookie("token", jwtToken);
    res.json({ message: "User Add Successfully", data: newUser });
  } catch (err) {
    res.status(500).send(`Error adding user : ${err.message}`);
  }
});
authRouter.post("/login", async (req, res) => {
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
      res.json({
        success: true,
        message: "Profile retrieved successfully",
        data: user,
      });
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (err) {
    res.status(500).send(`Error : ${err.message}`);
  }
});
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out successfully!!! ");
});
module.exports = authRouter;
