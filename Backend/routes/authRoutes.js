const express = require("express");
const {
  Register,
  Login,
  logout,
  forgotPassword,
  googleAuth
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/", Register);                 // Register route
router.post("/login", Login);              // Login route
router.post("/logout", logout);            // Logout route
router.get("/forgotpassword", forgotPassword); // Forgot password page
router.post("/auth/google", googleAuth);   // Google OAuth route
router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

module.exports = router;
