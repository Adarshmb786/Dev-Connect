const mongoose = require("mongoose");

const requestsSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is Invalid status type.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestsSchema);
