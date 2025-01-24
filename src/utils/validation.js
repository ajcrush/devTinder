const validator = require("validator");
const mongoose = require("mongoose");
const ConnectionRequest = require("../config/models/connectionRequest");
const User = require("../config/models/user");
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
    "gender",
    "age",
  ];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
    return false;
  }
  return isAllowed;
};

const validateInputPassword = (req) => {
  const { currentPassword, newPassword } = req.body;

  // Allowed fields to check for extraneous data
  const allowedEditFields = ["currentPassword", "newPassword"];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  // Check for any invalid fields
  if (!isAllowed) {
    return {
      isValid: false,
      message:
        "Invalid fields in the request body. Only 'currentPassword' and 'newPassword' are allowed.",
    };
  }

  // Ensure both current and new passwords are provided
  if (!currentPassword || !newPassword) {
    return {
      isValid: false,
      message: "Both current and new passwords are required.",
    };
  }

  // Check for strong password
  if (!validator.isStrongPassword(newPassword)) {
    return {
      isValid: false,
      message:
        "New password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.",
    };
  }

  // All checks passed
  return {
    isValid: true,
  };
};
const connectionRequestValidation = async (fromUserId, toUserId, status) => {
  const isAllowedStatus = ["ignored", "interested"];

  //validate status
  if (!isAllowedStatus.includes(status)) {
    throw new Error("Invalid status.");
  }

  //prevent self request
  if (fromUserId.equals(toUserId)) {
    throw new Error("Cannot send a request to yourself.");
  }

  // check if the reciepent user exists
  const user = await User.findById(toUserId);
  if (!user) {
    throw new Error("User does not exist in the database.");
  }
  const duplicateRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (duplicateRequest) {
    throw new Error("A connection request already exists.");
  }
  return user;
};
const connectionReviewValidation = async (loggedInUser, status, requestId) => {
  const isAllowedStatus = ["accepted", "rejected"];

  //Validate status
  if (!isAllowedStatus.includes(status)) {
    throw new Error(
      "Invalid status. Allowed statuses are: accepted, rejected."
    );
  }

  //Validate requestId format
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error("Invalid requestId format");
  }

  // Find the connection request for loggedIn user
  const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status: "interested",
  });
  if (!connectionRequest) {
    throw new Error("Connection request not found or already processed.");
  }
  return connectionRequest;
};
const chatValidation = (targetUserId, userId) => {
  if (!targetUserId) {
    throw new Error("Please provide a target user ID.");
  }
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new Error("Invalid target user ID format.");
  }
  if (userId.toString() === targetUserId) {
    throw new Error("Cannot start a chat with yourself.");
  }
};
module.exports = {
  userValidation,
  validateEditProfileData,
  validateInputPassword,
  loginValidation,
  connectionRequestValidation,
  connectionReviewValidation,
  chatValidation,
};
