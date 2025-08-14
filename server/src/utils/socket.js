const socket = require("socket.io");
const Chat = require("../models/chatModel");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, receiverId }) => {
      const roomId = [userId, receiverId].sort().join("$$$");
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({
        fullName,
        profilePic,
        userId,
        receiverId,
        message,
        time,
        fullDate,
      }) => {
        const chatExists = await Chat.findOne({
          participants: { $all: [userId, receiverId] },
        });
        if (chatExists) {
          chatExists.messages.push({
            senderId: userId,
            message: message,
            time: time,
            date: fullDate,
          });
          await chatExists.save();
        } else {
          const newChat = new Chat({
            participants: [userId, receiverId],
            messages: {
              senderId: userId,
              message: message,
              time: time,
              date: fullDate,
            },
          });
          await newChat.save();
        }
        const roomId = [userId, receiverId].sort().join("$$$");

        io.to(roomId).emit("messageReceived", {
          userId,
          fullName,
          profilePic,
          message,
          time,
          fullDate,
        });
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
