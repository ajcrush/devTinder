const express = require("express");
const { Chat } = require("../config/models/chat");
const { userAuth } = require("../middlewares/auth");
const { chatValidation } = require("../utils/validation");

const chatRouter = express.Router();
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params; // Get the target user ID from the request params
  const userId = req.user._id; // Get the user ID from the request object

  try {
    chatValidation(targetUserId, userId); // Validate the target user ID and user ID
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.sender",
      select: "firstName lastName ",
    }); // Find a chat that has both the user ID and target user ID in the participants array
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    } // If no chat is found, create a new chat with the user ID and target user ID
    await chat.save(); // Save the chat
    res.json({
      message: "Chat retrieved successfully",
      chat,
    });
  } catch (err) {
    console.error("Error retrieving or creating chat:", err.message);
    // Respond with appropriate status and error message
    res.status(400).json({ error: err.message });
  } // Add a try-catch block to handle errors
});
module.exports = chatRouter;
