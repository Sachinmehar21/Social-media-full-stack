const express = require("express");
const { Register, Login, logout, forgotPassword } = require("../controllers/authControllers");

const router = express.Router();

router.post("/", Register); // Handle user registration
router.post("/login", Login); // Handle login
router.post("/logout", logout); // Logout user
router.get("/forgotpassword", forgotPassword); // Forgot password page

module.exports = router;