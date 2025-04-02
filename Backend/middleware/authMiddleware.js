const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//secret key for token verification
const secret = process.env.secret;

//Token verification middleware
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

        const decoded = jwt.verify(token, secret);
       
        const user = await User.findById(decoded._id);
        if (!user) return res.status(401).send("User not found.");
        
        req.user = user;
        next();
};

module.exports = verifyToken;   