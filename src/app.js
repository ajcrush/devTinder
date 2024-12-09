const express = require("express");

const app = express();
app.get("/user", (req, res) => {
  res.send({ firstName: "Mohit", lastName: "Sharma" });
});
app.post("/user", (req, res) => {
  res.send("sent to database");
});
app.delete("/user", (req, res) => {
  res.send("Deleted");
});
app.use("/", (req, res) => {
  res.send("Home route");
});
app.listen(7777, () => {
  console.log("Server is working");
});
