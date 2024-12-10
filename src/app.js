const express = require("express");

const app = express();
app.get(
  "/user",
  (req, res, next) => {
    console.log("In route one");
    // res.send("Route 1 trigerred");
    next();
  },
  [
    (req, res, next) => {
      console.log("In route two");
      // res.send("Route 2 trigerred");
      next();
    },
    (req, res, next) => {
      console.log("In route three");
      res.send("Route 3 trigerred");
    },
  ]
);

app.listen(7777, () => {
  console.log("Server is working");
});
