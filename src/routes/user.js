const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../config/models/connectionRequest");
const User = require("../config/models/user");
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "gender",
  "age",
  "skills",
  "photoUrl",
  "about",
];
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // Step 1: Parse and validate query parameters
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Step 2: Get the logged-in user
    const loggedInUser = req.user;

    // Step 3: Fetch connection requests for the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    // Step 4: Build a set of user IDs to exclude from the feed
    const hiddenUserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hiddenUserFromFeed.add(request.fromUserId.toString());
      hiddenUserFromFeed.add(request.toUserId.toString());
    });

    // Step 5: Fetch eligible users with pagination
    const user = await User.find({
      _id: { $nin: Array.from(hiddenUserFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    // Step 6: Send the response
    res.send(user);
  } catch (err) {
    // Log error and send appropriate response
    console.error(`Error Occurred: ${err.message}`);
    res.status(400).send("Error : " + err.message);
  }
});
module.exports = userRouter;
