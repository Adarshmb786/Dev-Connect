const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/userModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/profilePicture");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.patch(
  "/updateprofile",
  userAuth,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const allowed_updates = [
        "firstName",
        "lastName",
        "gender",
        "description",
        "skills",
        "age",
      ];
      const isAllowed = Object.keys(req.body).every((k) =>
        allowed_updates.includes(k)
      );
      if (!isAllowed) {
        throw new Error("Can't update.");
      }
      if (req.file) {
        req.body.profilePic = req.file.filename;
      }
      const data = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: req.body,
        },
        { runValidators: true, new: false }
      );
      if (req.file && data.profilePic !== "default.avif") {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "profilePicture",
          data.profilePic
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      res.status(200).json({
        message: "Profile updated successfully.",
      });
    } catch (err) {
      if (req.file) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "profilePicture",
          req.file.filename
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log("Error occured while deleting image ", err);
          }
        });
      }
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

router.get("/connection/viewprofile/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User doesn't exist.");
    }
    res.status(200).json({
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
