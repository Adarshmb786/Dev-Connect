const express = require("express");
const router = express.Router();
const { validateSignupLoginData } = require("../utils/validation");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth = require("../middleware/userAuth");
const validator = require("validator");

router.post("/signup", async (req, res) => {
  try {
    validateSignupLoginData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const isUserExist = await User.findOne({ emailId });
    if (isUserExist) {
      throw new Error("Email already exist.");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPass,
    });
    const user = await newUser.save();
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });
    res.status(200).json({
      message: "User created successfully",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    validateSignupLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new Error("Invalid credentials.");
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });

    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.post("/updatepassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const isCorrectOldPass = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCorrectOldPass) {
      throw new Error("Current password is incorrect.");
    }
    if (currentPassword === newPassword) {
      throw new Error("New password should be different.");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Enter a strong password.");
    }
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    await user.save();
    res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.get("/checklogin", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      data: req.user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});
module.exports = router;
