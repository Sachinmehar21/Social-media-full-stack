//dependencies imported
const express = require('express');
const app = express();

//importing schemas
const User = require("../models/userModel")
const Post = require("../models/postmodel");
const Comment = require("../models/commentmodel");

//middleware for token verificationv
const verifyToken = require("../middleware/authMiddleware");

//tokengenration 
const secret = process.env.secret;
const generateToken = (user) => jwt.sign({ _id: user._id, email: user.email }, secret);

//cloudinary
const cloudinary = require("../config/cloudinary"); 
const upload = require("../middleware/uploadMiddleware");

//upload(post)
module.exports.upload = [verifyToken, async (req, res) => {
    res.render('upload')
}]

//post
module.exports.post = [verifyToken,upload.single('media'), async (req,res) => {
    const user = req.user;
    const { caption } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
        transformation: [
            { width: 300, height: 300, crop: "thumb", gravity: "face" } // Square crop with face focus
        ]
    });

    const post = await Post.create({
        author: user._id, 
        media: result.secure_url,
        caption
    });

    if (!user.posts) user.posts = []; 
    user.posts.push(post._id);

    await post.save();
    await user.save();
    res.redirect(`/profile/${user.username}`)
}]

//delete post
module.exports.deletePost = [verifyToken, async(req, res) => {
    const postid = req.params.id;
    const user = req.user;
    await Post.findByIdAndDelete(postid);
    res.redirect(`/profile/${user.username}`)
}]

//like
module.exports.likePost = [verifyToken, async(req,res) => {
    const post = await Post.findById(req.params.id)
    const user = req.user;
    if (!post.likes.includes(user._id)) {
        post.likes.push(user._id); // ✅ Add user ID if not already present
        await post.save();
    }
    res.redirect(`/profile/${user.username}`)
}]

// if (!post.likes.includes(user._id)) {
//     // ✅ If user hasn't liked the post, add their ID
//     post.likes.push(user._id);
// } else {
//     // ✅ If user has already liked, remove their ID (unlike)
//     post.likes = post.likes.filter(id => id.toString() !== user._id.toString());
// }

//posts(feed)   
module.exports.allPosts = [verifyToken, async(req,res) => {
    const posts = await Post.find({})

    res.render("allposts", { posts });
}]

//addcomment
module.exports.addComment = [verifyToken, async (req,res) => {
    const user = req.user;
    const { postId } = req.params;
    const { text } = req.body;
    console.log("Received postId:", postId);

    const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

    const comment = await Comment.create({ text,
        user: user._id,
        post: post._id
     })

    post.comments.push(comment._id);

    await comment.save();
    await post.save();

    res.redirect(`/profile/${user.username}`);
}]

//deletecomment
module.exports.deleteComment = [verifyToken, async (req,res) => {
    const user = req.user;

    const { commentId} = req.params;
    const comment = await Comment.findById(commentId);

    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id },
    });

    await comment.deleteOne();

    res.redirect(`/profile/${user.username}`);
}];