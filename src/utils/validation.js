const validator = require("validator");
const userValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter valid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."
    );
  }
};
const loginValidation = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error("Please enter valid email id");
  }
};
module.exports = { userValidation, loginValidation };
