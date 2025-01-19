const jwt = require("jsonwebtoken");
const User = require("../config/models/user");
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .send("Authentication token missing. Please Log in !!!");
  }
  try {
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      res.status(400).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};
module.exports = { userAuth };
