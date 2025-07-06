//dependencies imported
const express = require("express");
const app = express();

//importing schemas
const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//tokengenration
const secret = process.env.secret;
const generateToken = (user) =>
  jwt.sign({ _id: user._id, email: user.email }, secret);

//postregister
module.exports.Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).send("User already registered");

    //bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log before saving
    console.log("Saving user:", { username, email });

    // Create and save the user
    const user = await User.create({ username, email, password: hashedPassword });

    // Log after saving
    console.log("User saved:", user);

    // Generate token after save
    const token = generateToken(user);
    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      username: user.username,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

//postlogin
module.exports.Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid email or password");
  }

  res.cookie("token", generateToken(user));

  res.json({ username: user.username });
};

//logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

//getforgotpassword
module.exports.forgotPassword = (req, res) => {
  res.render("forgotpassword");
};
