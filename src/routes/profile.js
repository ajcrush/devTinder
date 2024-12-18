const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateInputPassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();
profileRouter.get("/profile/view", userAuth, async (req, res) => {
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
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send(`Error : ${err.message}`);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const validationResult = validateInputPassword(req);
    if (!validationResult.isValid) {
      return res.status(400).send(validationResult.message);
    }
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send("Current password is incorrect.");
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.save();
    res.status(200).send("Password updated successfully!!");
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});
module.exports = profileRouter;
