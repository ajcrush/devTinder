const socket = require("socket.io");
const crypto = require("crypto");
const { get } = require("http");
const { Chat } = require("../config/models/chat");
const ConnectionRequestModel = require("../config/models/connectionRequest");
const getSecretRoomID = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    // Handle event
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomID(userId, targetUserId);
      console.log(firstName + " Joined room : ", roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomID(userId, targetUserId);
          console.log(firstName + " " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ sender: userId, text });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (err) {
          console.error(err);
        }
      }
    );
    socket.on("offer", ({ target, offer }) => {
      socket.to(target).emit("offer", { from: socket.id, offer });
    });
    socket.on("answer", ({ target, answer }) => {
      socket.to(target).emit("answer", { from: socket.id, answer });
    });
    socket.on("ice-candidate", ({ target, candidate }) => {
      socket.to(target).emit("ice-candidate", { from: socket.id, candidate });
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = initializeSocket;
