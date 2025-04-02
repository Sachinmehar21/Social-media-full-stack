const express = require("express");
const { profile, homepage, Edit, getUsers, follow, unfollow } = require("../controllers/userControllers");

const router = express.Router();

router.get("/homepage", homepage); // Fixed homepage route
router.get("/profile/:name", profile);
router.post("/profile/:id/edit", Edit); 
router.get("/users", getUsers); // Fixed method to GET instead of POST
router.post("/follow/:username", follow);
router.post("/unfollow/:username", unfollow);

module.exports = router;