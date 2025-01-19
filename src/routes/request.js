const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../config/models/connectionRequest");
const sendEmail = require("../utils/sendEmail");
const User = require("../config/models/user");
const {
  connectionRequestValidation,
  connectionReviewValidation,
} = require("../utils/validation");
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
      const emailRes = await sendEmail.run(
        "A new friend request from",
        `Request sent successfully. User ${user.firstName} has been notified of your interest.`
      );
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
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      //Validate the connection review Request
      const connectionRequest = await connectionReviewValidation(
        loggedInUser,
        status,
        requestId
      );
      //Update status
      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();
      //Response with success
      res.status(200).json({
        success: true,
        message: `Connection request has been ${status}.`,
        data: updatedRequest,
      });
    } catch (err) {
      // Internal server error
      res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }
);
module.exports = requestRouter;
