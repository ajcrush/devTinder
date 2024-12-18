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
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
  ];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  if (!validator.isURL(req.body.photoUrl)) {
    return false;
  }
  return isAllowed;
};
const validateInputPassword = (req) => {
  const allowedEditFields = ["currentPassword", "newPassword"];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  if (!isAllowed) {
    return {
      isValid: false,
      message: "Invalid fields in the request body.",
    };
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return {
      isValid: false,
      message: "Both current and new passwords are required",
    };
  }
  if (!validator.isStrongPassword(newPassword)) {
    return {
      isValid: false,
      message:
        "New password must be at least 8 characters long, contain a mix of letters, numbers, and special characters.",
    };
  }
  return {
    isValid: true,
  };
};
module.exports = {
  userValidation,
  validateEditProfileData,
  validateInputPassword,
  loginValidation,
};
