const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/educonnect")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  role: String,
  subject: String
});

const User = mongoose.model("User", userSchema);

// Register API
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "User saved" });
});

// Get users API
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});