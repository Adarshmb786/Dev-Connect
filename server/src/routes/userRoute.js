const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const Request = require("../models/requestsModel");
const User = require("../models/userModel");

router.get("/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const allRequest = await Request.find({
      receiverId: user._id,
      status: "interested",
    })
      .select("senderId")
      .populate("senderId", "-emailId -password");
    if (allRequest.length === 0) {
      throw new Error("No request found.");
    }
    res.status(200).json({
      data: allRequest,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.get("/connections", userAuth, async (req, res) => {
  try {
    const connections = await Request.find({
      $or: [
        { senderId: req.user._id, status: "accepted" },
        { receiverId: req.user._id, status: "accepted" },
      ],
    }).populate("senderId receiverId");
    if (connections.length === 0) {
      throw new Error("No connections found.");
    }
    const id = connections.map((item) => {
      if (item.senderId._id.toString() !== req.user._id.toString()) {
        return item.senderId._id;
      } else {
        return item.receiverId._id;
      }
    });
    const allConnections = await User.find({ _id: { $in: id } }).select(
      "-emailId -password"
    );
    res.status(200).json({
      data: allConnections,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const connections = await Request.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    });

    const userIds = connections.map((item) => {
      if (item.senderId.toString() === req.user._id.toString()) {
        return item.receiverId;
      } else {
        return item.senderId;
      }
    });

    const feed = await User.find({
      $and: [{ _id: { $ne: req.user._id } }, { _id: { $nin: userIds } }],
    }).select("-emailId -password");

    res.status(200).json({
      data: feed,
    });
  } catch (err) {
    res.status(200).json({
      message: err.message,
    });
  }
});

module.exports = router;
