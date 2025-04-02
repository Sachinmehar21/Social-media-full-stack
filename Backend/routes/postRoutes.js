const express = require("express");
const { upload, post, deletePost, likePost, allPosts, addComment, deleteComment } = require("../controllers/postControllers");

const router = express.Router();

router.get("/upload", upload); // Show upload post page
router.post("/post", post); // Create a new post
router.post("/deletepost/:id", deletePost); // Delete a post
router.post("/likepost/:id", likePost); // Like a post
router.get("/allposts", allPosts); // Get all posts
router.post("/addcomment/:postId", addComment); // Add a comment
router.post("/deletecomment/:commentId", deleteComment); // Delete a comment

module.exports = router;
