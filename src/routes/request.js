const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
requestRouter.post("/sendConnection", userAuth, async (req, res, next) => {
  try {
    const user = req.user;

    res.send(`${user.firstName} is sending connection request`);
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});
module.exports = requestRouter;
