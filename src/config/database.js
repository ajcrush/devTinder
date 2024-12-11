const mongoose = require("mongoose");
const url =
  "mongodb+srv://mohitanand89878:KaXQhLGwVJG1I5Xc@namastenode.gvwka.mongodb.net/devTinder";
const connectDB = async () => {
  await mongoose.connect(url);
};
module.exports = connectDB;
