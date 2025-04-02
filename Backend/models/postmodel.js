const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    media: String,
    caption: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    },
    { timestamps: true });

module.exports = mongoose.model('Post',postSchema)