const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorised = token === "abc";
  if (!isAuthorised) {
    return res.status(401).send("Unauthorised Accessed to admin");
  }
  next();
};
const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorised = token === "xdd";
  if (!isAuthorised) {
    return res.status(401).send("Unauthorised Accessed to user");
  }
  next();
};
module.exports = { adminAuth, userAuth };
