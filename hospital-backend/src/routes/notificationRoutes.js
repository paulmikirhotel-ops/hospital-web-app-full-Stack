const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/notifications
 * @desc    Fetch latest 20 notifications for the logged-in user
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        // Increased limit to 20 for a better user experience
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20); 
            
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching notifications" });
    }
});

/**
 * @route   PATCH /api/notifications/read/:id
 * @desc    Mark a specific notification as read
 */
router.patch('/read/:id', verifyToken, async (req, res) => {
    try {
        // 🛡️ SECURITY: Ensure the notification actually belongs to the user
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, 
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Clear all unread badges for the user
 */
router.patch('/read-all', verifyToken, async (req, res) => {
    try {
        // 🚀 NEW: Bulk update for better UX
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Remove a specific notification
 */
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // 🛡️ SECURITY: Only delete if it belongs to the requester
        const result = await Notification.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!result) return res.status(404).json({ message: "Notification not found" });
        
        res.json({ success: true, message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;