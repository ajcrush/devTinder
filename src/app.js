const express = require("express");

const app = express();
app.use("/test", (req, res) => {
  res.send("Test route");
});
app.use("/hello", (req, res) => {
  res.send("Hello route");
});
app.use("/", (req, res) => {
  res.send("Home route");
});
app.listen(7777, () => {
  console.log("Server is working");
});
