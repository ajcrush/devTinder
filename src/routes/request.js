const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../config/models/connectionRequest");
const User = require("../config/models/user");
const { connectionRequestValidation } = require("../utils/validation");
const requestRouter = express.Router();
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      //Validate connection request
      const user = await connectionRequestValidation(
        fromUserId,
        toUserId,
        status
      );
      const requestUser = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await requestUser.save();
      let message;
      if (status === "interested") {
        message = `Request sent successfully. User ${user.firstName} has been notified of your interest.`;
      }
      if (status === "ignored") {
        message = `Request marked as ignored for user ${user.firstName}.`;
      }
      res.status(201).send({ message, data: user });
    } catch (err) {
      res.status(500).send(`Error : ${err.message}`);
    }
  }
);
module.exports = requestRouter;
