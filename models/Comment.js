const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    author: { type: String, required: true },
    body: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);