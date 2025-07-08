const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");

const secret = process.env.secret;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// token generation
const generateToken = (user) =>
  jwt.sign({ _id: user._id, email: user.email }, secret);

// REGISTER
module.exports.Register = async (req, res) => {
  const { username, email, password } = req.body;

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "User already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({
    message: "User registered successfully",
    username: user.username,
    profilePic: user.profilePic || "", // just in case
    token: token,
  });
};

// LOGIN
module.exports.Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({
    username: user.username,
    profilePic: user.profilePic || "", // add this too
    token,
  });
};

// LOGOUT
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// FORGOT PASSWORD
module.exports.forgotPassword = (req, res) => {
  res.render("forgotpassword");
};

// GOOGLE OAUTH
module.exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const randomUsername = name?.replace(/\s/g, "") || `user${sub.slice(-5)}`;
      user = await User.create({
        username: randomUsername,
        email,
        password: "google_oauth_no_password", // dummy
        profilePic: picture, // ✅ SAVE profilePic from Google
      });
    }

    const jwtToken = generateToken(user);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      token: jwtToken,
      username: user.username,
      profilePic: user.profilePic || "", // ✅ SEND BACK TO FRONTEND
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};
