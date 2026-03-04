const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/comments/add
 * @desc    Add a comment/review to a Doctor or Blog
 */
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { comment, doctorId, blogId, rating } = req.body;
        const userId = req.user.id; 

        const newComment = new Comment({
            userId,
            comment,
            doctorId: doctorId || null,
            blogId: blogId || null,
            rating: rating || 0
        });

        await newComment.save();
        res.status(201).json({ success: true, message: "Comment added!", data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   GET /api/comments/doctor/:id
 * @desc    Get all reviews for a specific doctor
 */
router.get('/doctor/:id', async (req, res) => {
    try {
        const comments = await Comment.find({ doctorId: req.params.id })
            .populate('userId', 'name image') 
            .sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   GET /api/comments/blog/:id
 * @desc    Get all comments for a blog post
 */
router.get('/blog/:id', async (req, res) => {
    try {
        const comments = await Comment.find({ blogId: req.params.id })
            .populate('userId', 'name image')
            .sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   PUT /api/comments/update/:id
 * @desc    Update a comment (Owner Only)
 */
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const commentId = req.params.id;

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) return res.status(404).json({ success: false, message: "Comment not found" });

        // 🛡️ Security Check: Only the author can update
        if (existingComment.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized edit" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $set: { comment, rating } },
            { new: true }
        );

        res.json({ success: true, message: "Comment updated!", data: updatedComment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   DELETE /api/comments/delete/:id
 * @desc    Delete a comment (Owner or Admin)
 */
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const existingComment = await Comment.findById(req.params.id);
        if (!existingComment) return res.status(404).json({ success: false, message: "Comment not found" });

        // 🛡️ MODIFIED SECURITY: Owner CAN delete, AND Admin CAN delete
        const isOwner = existingComment.userId.toString() === req.user.id;
        const isSiteAdmin = req.user.role === 'admin';

        if (!isOwner && !isSiteAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized delete attempt" });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Comment removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;