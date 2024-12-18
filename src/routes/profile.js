const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
profileRouter.get("/profile", userAuth, async (req, res) => {
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
module.exports = profileRouter;
