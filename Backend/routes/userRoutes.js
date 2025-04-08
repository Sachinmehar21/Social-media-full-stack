const express = require("express");
const { profile, homepage, Edit, getUsers, follow, unfollow, feed } = require("../controllers/userControllers");

const router = express.Router();

router.get("/profile/:name", profile);  // ✅
router.post("/profile/:id/edit", Edit);  // ✅
router.get("/users", getUsers);  // ✅
router.post("/follow/:username", follow);  // ✅
router.post("/unfollow/:username", unfollow);  // ✅
router.get("/feed", feed);  // ✅

module.exports = router;