const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Comment = require('../models/Comment');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- THE MASTER ANALYSIS ROUTE ---
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const [users, blogs, services, appointments, commentCount] = await Promise.all([
            User.find({}, 'role'),
            Blog.countDocuments(),
            Service.countDocuments(),
            Appointment.find().populate('userId', 'name').populate('doctorId', 'name').sort({ createdAt: -1 }),
            Comment.countDocuments()
        ]);

        // Calculate Revenue from Paid Appointments
        const revenue = appointments
            .filter(app => app.payment === true)
            .reduce((acc, curr) => acc + (curr.amount || 0), 0);

        res.status(200).json({
            success: true,
            stats: {
                revenue,
                totalAppointments: appointments.length,
                patients: users.filter(u => u.role === 'user').length,
                doctors: users.filter(u => u.role === 'doctor').length,
                services,
                blogs,
                comments: commentCount
            },
            recentActivity: appointments // Sending full list for the frontend search
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;