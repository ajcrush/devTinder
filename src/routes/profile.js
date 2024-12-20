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
    // Validate the input data
    const validationResult = validateInputPassword(req);
    if (!validationResult.isValid) {
      return res.status(400).send(validationResult.message);
    }

    // Access the authenticated user and input data
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    // Check if the current password matches the stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send("Current password is incorrect.");
    }

    // Hash the new password and update it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    // Respond with success
    res.status(200).send("Password updated successfully!");
  } catch (err) {
    // Catch unexpected errors and respond
    res.status(500).send(`Error: ${err.message}`);
  }
});
module.exports = profileRouter;
