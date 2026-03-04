const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { verifyToken } = require('../middleware/authMiddleware');
const crypto = require('crypto');

/**
 * @route   POST /api/meeting/create
 * @desc    Generate a secure video room (Called by Doctor)
 */
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { appointmentId, patientId } = req.body;
        
        // 🛡️ SECURITY: Ensure only doctors can initiate a meeting
        if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Only doctors can start a meeting." });
        }

        // Generate a secure, unguessable Room ID
        const roomId = `SaintJoseph-${crypto.randomBytes(8).toString('hex')}`;

        const newMeeting = await Meeting.create({
            appointmentId,
            doctorId: req.user.id, // 🚀 UPDATED: Changed from req.userId
            patientId,
            roomId,
            status: 'active'
        });

        res.status(201).json({ success: true, roomId: newMeeting.roomId });
    } catch (error) {
        console.error("Meeting Creation Error:", error);
        res.status(500).json({ success: false, message: "Could not initialize meeting." });
    }
});

/**
 * @route   GET /api/meeting/join/:appointmentId
 * @desc    Fetch active room ID for an appointment
 */
router.get('/join/:appointmentId', verifyToken, async (req, res) => {
    try {
        const meeting = await Meeting.findOne({ 
            appointmentId: req.params.appointmentId,
            status: 'active' 
        });

        if (!meeting) {
            return res.status(404).json({ success: false, message: "No active meeting found." });
        }

        // 🛡️ SECURITY check: Is the requester linked to this meeting?
        const isParticipant = meeting.doctorId.toString() === req.user.id || 
                            meeting.patientId.toString() === req.user.id;

        if (!isParticipant && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized access to this room." });
        }

        res.json({ success: true, roomId: meeting.roomId });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error joining meeting." });
    }
});

/**
 * @route   PATCH /api/meeting/end/:roomId
 * @desc    Deactivate a meeting room
 */
router.patch('/end/:roomId', verifyToken, async (req, res) => {
    try {
        // Only allow the assigned doctor or admin to end the session
        const meeting = await Meeting.findOne({ roomId: req.params.roomId });
        
        if (!meeting) return res.status(404).json({ message: "Meeting not found" });

        if (meeting.doctorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized." });
        }

        meeting.status = 'completed';
        await meeting.save();
        
        res.json({ success: true, message: "Meeting session closed." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error ending meeting." });
    }
});

module.exports = router;