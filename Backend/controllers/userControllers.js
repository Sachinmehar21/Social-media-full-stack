const express = require("express");
const app = express();
const User = require("../models/userModel");
const Post = require("../models/postmodel");
const Comment = require("../models/commentmodel");
const verifyToken = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");

// Homepage Route
module.exports.homepage = (req, res) => {   
    res.render("homepage");
};

// Profile Route
module.exports.profile = [verifyToken, async (req, res) => {
    try {
        const { name } = req.params;  
        const user = await User.findOne({ username: name })
            .populate("following", "username profilepicture") 
            .populate({
                path: "posts",
                select: "media caption likes comments",
                populate: {
                    path: "comments",
                    populate: { path: "user", select: "username" }
                }
            });

        if (!user) return res.status(404).json({ message: "User not found" });

        const currentUser = req.user;
        const isFollowing = user.followers.some(follower => follower.toString() === currentUser._id.toString());

        res.json({
            user: {
                ...user.toObject(),
                isCurrentUser: user._id.toString() === currentUser._id.toString(),
                isFollowing
            },
            posts: user.posts || [],
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
}];

// Edit Profile Route
module.exports.Edit = [verifyToken, upload.single("file"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "profile_pictures",
                transformation: [
                    { width: 400, height: 400, crop: "thumb", gravity: "face" },
                    { radius: "max" },
                    { effect: "sharpen" },
                    { quality: "auto:best" },
                    { fetch_format: "auto" },
                ],
            });
            user.profilepicture = result.secure_url;
        }

        if (req.body.username && req.body.username !== user.username) {
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Username already taken" });
            }
            user.username = req.body.username;
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
}];

// Get All Users
module.exports.getUsers = [verifyToken, async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const users = await User.find({}, "username profilepicture");
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
}];

// Follow a User
module.exports.follow = [verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        const user = req.user;
        const userToFollow = await User.findOne({ username });

        if (!userToFollow) return res.status(404).json({ message: "User not found" });

        if (!userToFollow.followers.includes(user._id)) {
            userToFollow.followers.push(user._id);
            user.following.push(userToFollow._id);

            await userToFollow.save();
            await user.save();
        }

        res.json({ message: `You are now following ${username}` });
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ message: "Server error" });
    }
}];

// Unfollow a User
module.exports.unfollow = [verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        const user = req.user;
        const userToUnfollow = await User.findOne({ username });

        if (!userToUnfollow) return res.status(404).json({ message: "User not found" });

        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== user._id.toString());
        user.following = user.following.filter(id => id.toString() !== userToUnfollow._id.toString());

        await userToUnfollow.save();
        await user.save();

        res.json({ message: `You have unfollowed ${username}` });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        res.status(500).json({ message: "Server error" });
    }
}];
