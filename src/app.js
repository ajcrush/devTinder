const express = require("express");
const app = express();
app.get("/user", (req, res, next) => {
  try {
    throw new error("edfhfe");
  } catch (err) {
    res.status(500).send("Some error occured 1");
  }
});
app.use("/", (err, req, res, next) => {
  res.status(500).send("Error occured");
});
app.listen(7777, () => {
  console.log("Server is working");
});
