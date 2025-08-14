const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Login again.",
      });
    }
    const { userId } = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User doesn't exist.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = userAuth;
