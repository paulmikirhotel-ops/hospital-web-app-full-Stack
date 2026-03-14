const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/authMiddleware');

/* ── HELPER: validate a MongoDB ObjectId ─────────────────────── */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);


/**
 * GET /api/notifications
 * Fetch latest 20 notifications for the logged-in user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // faster — returns plain JS objects

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error('GET /notifications error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
});


/**
 * PATCH /api/notifications/read-all
 * Mark ALL notifications as read for the user
 * ⚠️  Must be defined BEFORE /read/:id — otherwise Express matches
 *     "read-all" as the :id param and the wrong route fires.
 */
router.patch('/read-all', verifyToken, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error('PATCH /notifications/read-all error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * PATCH /api/notifications/read/:id
 * Mark a single notification as read
 */
router.patch('/read/:id', verifyToken, async (req, res) => {
  try {
    // Guard: invalid ObjectId crashes findOneAndUpdate with a cast error
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Marked as read', notification });
  } catch (error) {
    console.error('PATCH /notifications/read/:id error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * DELETE /api/notifications/:id
 * Delete a single notification
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    const result = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('DELETE /notifications/:id error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * POST /api/notifications   (internal utility — call from other controllers)
 * Creates a notification for a user.
 *
 * Usage from another controller:
 *   const { createNotification } = require('./notificationRoutes');
 *   await createNotification(userId, 'Your appointment is confirmed', 'Appointment', '/appointments');
 */
const createNotification = async (userId, message, type = 'System', link = null) => {
  try {
    const notification = await Notification.create({ userId, message, type, link });
    return notification;
  } catch (error) {
    console.error('createNotification error:', error.message);
    return null;
  }
};

module.exports = router;
module.exports.createNotification = createNotification;