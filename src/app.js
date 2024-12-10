const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();
app.use("/admin", adminAuth);
app.get("/admin/xyz", (req, res, next) => {
  res.send("Admin accessed");
});
app.get("/user/login", (req, res, next) => {
  res.send("Login here");
});
app.get("/user/data", userAuth, (req, res, next) => {
  res.send("user accessed");
});

app.listen(7777, () => {
  console.log("Server is working");
});
