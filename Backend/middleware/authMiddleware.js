const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//secret key for token verification
const secret = process.env.secret;

//Token verification middleware
const verifyToken = async (req, res, next) => {
    let token = req.cookies.token;
    // Also check Authorization header (for Bearer tokens)
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader;
        }
    }
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded._id);
        if (!user) return res.status(401).send("User not found.");
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;   