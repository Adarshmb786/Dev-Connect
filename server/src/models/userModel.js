const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [10, "First name cannot be more than 10 characters long."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [10, "Last name cannot be more than 10 characters long."],
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email.");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password.");
        }
      },
    },
    profilePic: {
      type: String,
      default: "default.avif",
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Not a valid gender.",
      },
    },
    description: {
      type: String,
      maxlength: [700, "Description cannot be more than 400 characters."],
      trim: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error("Age must be atleast 18");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 15) {
          throw new Error("Cannot add more than 15 skills");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
