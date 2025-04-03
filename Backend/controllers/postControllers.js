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

// Show upload page
module.exports.upload = [verifyToken, (req, res) => {
    res.render("upload");
}];

//post
module.exports.post = [verifyToken,upload.single('media'), async (req,res) => {
    try {
        const user = req.user;
        const { caption } = req.body;

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "posts",
            transformation: [
                { width: 300, height: 300, crop: "fill" } // Simple square crop without face focus
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
        
        // Return JSON response instead of redirecting
        res.json({ 
            success: true,
            post,
            user: {
                _id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ 
            success: false,
            message: "Error creating post"
        });
    }
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
    try {
        const post = await Post.findById(req.params.id);
        const user = req.user;
        
        if (!post.likes.includes(user._id)) {
            // Like the post
            post.likes.push(user._id);
        } else {
            // Unlike the post
            post.likes = post.likes.filter(id => id.toString() !== user._id.toString());
        }
        
        await post.save();
        
        res.json({ 
            success: true,
            likes: post.likes,
            isLiked: post.likes.includes(user._id)
        });
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ 
            success: false,
            message: "Error liking/unliking post"
        });
    }
}]

//posts(feed)   
module.exports.allPosts = [verifyToken, async(req,res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'username profilepicture')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({ 
            success: true,
            posts 
        });
    } catch (error) {
        console.error("Error fetching all posts:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching posts"
        });
    }
}]

//addcomment
module.exports.addComment = [verifyToken, async (req,res) => {
    try {
        const user = req.user;
        const { postId } = req.params;
        const { text } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = await Comment.create({ 
            text,
            user: user._id,
            post: post._id
        });

        post.comments.push(comment._id);
        await post.save();

        // Populate the comment with user data
        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'username');

        res.json({ 
            success: true,
            comment: populatedComment
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ 
            success: false,
            message: "Error adding comment"
        });
    }
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