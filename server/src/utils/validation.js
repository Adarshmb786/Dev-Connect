const validator = require("validator");

const validateSignupLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid email.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password.");
  }
};

module.exports = { validateSignupLoginData };
