const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

router.get("/allmessages/:receiverId", userAuth, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const isUserExist = await User.findById(receiverId);
    if (!isUserExist) {
      throw new Error("User doesn't exist.");
    }
    const chats = await Chat.findOne({
      participants: { $all: [req.user._id, receiverId] },
    })
      .select("messages -_id")
      .populate("messages.senderId");
    if (!chats) return;
    const messageDetails = chats.messages.map((item) => {
      const userId = item.senderId._id;
      const fullName = item.senderId.firstName + " " + item.senderId.lastName;
      const profilePic = item.senderId.profilePic;
      const message = item.message;
      const time = item.time;
      const fullDate = item.date;
      return { userId, fullName, profilePic, message, time, fullDate };
    });
    res.status(200).json({
      data: messageDetails,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
