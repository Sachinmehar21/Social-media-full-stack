const express = require("express");
const { upload, post, deletePost, likePost, addComment, deleteComment, getPostLikes } = require("../controllers/postControllers");

const router = express.Router();

router.get("/upload", upload); // ✅
router.post("/post", post); // ✅
router.post("/deletepost/:id", deletePost); // ✅
router.post("/likepost/:id", likePost); // ✅
router.post("/addcomment/:postId", addComment); // ✅
router.post("/deletecomment/:commentId", deleteComment); // ✅
router.get("/post/:id/likes", getPostLikes);

module.exports = router;
