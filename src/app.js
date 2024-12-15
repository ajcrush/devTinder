const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./config/models/user");
const { userValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());
// Get user by Email(/user)
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
// Get user by ID(/userId)
app.get("/userId", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
// DELETE user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
// Update data from User(id)
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const body = req.body;
  try {
    const ALLOWED_UPDATES = ["gender", "skills", "age", "about", "photoUrl"];
    const isValid = Object.keys(body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isValid) {
      throw new Error("Invalid update fields!! ");
    }
    const user = await User.findByIdAndUpdate(userId, body, {
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("user updated successfully");
    }
  } catch (err) {
    res.status(400).send("Update of user failed " + err.message);
  }
});
// Update data of user  using email
app.patch("/userEmail", async (req, res) => {
  const userEmail = req.body.emailId;
  const body = req.body;
  try {
    const user = await User.findOneAndUpdate({ emailId: userEmail }, body, {
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("Update of user failed " + err.message);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
// feed API - GET/ feed - get all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
app.post("/signup", async (req, res) => {
  try {
    userValidation(req);
    const { emailId, password, firstName, lastName } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const user = new User({
      emailId,
      firstName,
      lastName,
      password: passHash,
    });
    await user.save();
    res.send("User Add Successfully");
  } catch (err) {
    res.status(500).send(`Error adding user : ${err.message}`);
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
