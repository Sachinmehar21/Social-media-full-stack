const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    post:{ type:mongoose.Schema.Types.ObjectId, ref: 'post'},
    createdAt: { type: Date, default: Date.now },
},
{timestamps: true})

module.exports = mongoose.model('Comment',commentSchema);   