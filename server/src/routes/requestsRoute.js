const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const User = require("../models/userModel");
const Request = require("../models/requestsModel");

router.post("/send/:status/:receiverId", userAuth, async (req, res) => {
  try {
    const { status, receiverId } = req.params;
    const statusAllowed = ["interested", "ignored"];
    if (!statusAllowed.includes(status)) {
      throw new Error("Invalid status type");
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new Error("User doesn't exist.");
    }
    const requestAlreadyExist = await Request.find({
      $or: [
        { senderId: req.user._id, receiverId: receiverId },
        { senderId: receiverId, receiverId: req.user._id },
      ],
    });
    if (requestAlreadyExist.length > 0) {
      throw new Error("Cannot send request.");
    }
    if (receiverId.toString() === req.user._id.toString()) {
      throw new Error("You cannot send request yourself.");
    }
    const newRequest = new Request({
      senderId: req.user._id,
      receiverId: receiverId,
      status: status,
    });
    await newRequest.save();
    res.status(200).json({
      message:
        status === "interested"
          ? "Friend request send successfully."
          : "Ignored.",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.post("/review/:status/:userId", userAuth, async (req, res) => {
  try {
    const { status, userId } = req.params;
    const statusAllowed = ["accepted", "rejected"];
    if (!statusAllowed.includes(status)) {
      throw new Error("Invalid status type.");
    }
    const request = await Request.findOne({
      senderId: userId,
      receiverId: req.user._id,
      status: "interested",
    });
    if (!request) {
      throw new Error("Request doesn't exist");
    }
    request.status = status;
    await request.save();
    res.status(200).json({
      message:
        status === "accepted"
          ? "Friend request accepted successfully."
          : "Friend request rejected.",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
