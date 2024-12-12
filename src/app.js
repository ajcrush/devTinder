const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./config/models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Add Successfully");
  } catch (err) {
    res.status(500).send("Error adding user :", err.message);
  }
});
connectDB()
  .then(() => {
    console.log("Datatbase connection established ");
    app.listen(7777, () => {
      console.log("Server is working");
    });
  })
  .catch((err) => {
    console.error("Database connection not established");
  });
