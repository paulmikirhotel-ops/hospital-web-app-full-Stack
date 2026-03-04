const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    // Optional links
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', default: null },
    rating: { type: Number, min: 1, max: 5 }, // Mostly for doctors
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);