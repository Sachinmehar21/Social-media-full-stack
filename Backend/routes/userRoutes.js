const express = require("express");
const { profile, homepage, Edit, getUsers, follow, unfollow } = require("../controllers/userControllers");

const router = express.Router();

router.get("/profile/:name", profile);  // ✅
router.post("/profile/:id/edit", Edit);  // ✅
router.get("/users", getUsers);  // ✅
router.post("/follow/:username", follow);  // ✅
router.post("/unfollow/:username", unfollow);  // ✅

module.exports = router;