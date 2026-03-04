const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/payment/create-checkout-session
 * @desc    MOCK PAYMENT: Simulates creating a session
 */
router.post('/create-checkout-session', verifyToken, async (req, res) => {
    try {
        const { appointmentId } = req.body;
        
        // Simulating a delay like a real API call
        const mockSessionId = `mock_str_` + Math.random().toString(36).slice(2);

        // Instead of a Stripe URL, we point directly to our frontend success route
        // This lets you test the Frontend "Success" component immediately
        const mock_url = `http://localhost:5174/payment-success?session_id=${mockSessionId}&appointmentId=${appointmentId}`;

        res.json({ 
            success: true, 
            session_url: mock_url, 
            message: "Development Mode: Redirecting to Mock Success" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Mock payment failed" });
    }
});

/**
 * @route   GET /api/payment/verify
 * @desc    MOCK VERIFY: Instantly confirms the appointment
 */
router.get('/verify', verifyToken, async (req, res) => {
    try {
        const { appointmentId } = req.query;

        // We skip Stripe retrieval and just update the DB
        await Appointment.findByIdAndUpdate(appointmentId, {
            payment: true,
            status: 'Confirmed' 
        });

        res.json({ 
            success: true, 
            message: "Mock Payment Verified! Appointment is now Confirmed." 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;