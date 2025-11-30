// Import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/prpVillageDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Create User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create User Model
const User = mongoose.model("User", userSchema);

// --------------------------
// REGISTER API
// --------------------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const exists = await User.findOne({ username });
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  const newUser = new User({ username, password });
  await newUser.save();

  res.json({ success: true, message: "Registration successful!" });
});

// --------------------------
// LOGIN API
// --------------------------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ success: false, message: "Incorrect password" });
  }

  res.json({
    success: true,
    message: "Login successful!",
    token: "dummyToken123"
  });
});

// --------------------------
// Start Server
// --------------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});