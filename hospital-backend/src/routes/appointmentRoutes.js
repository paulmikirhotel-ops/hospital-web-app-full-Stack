const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ==========================================
// 1. PATIENT (USER) ROUTES
// ==========================================

// --- GET MY APPOINTMENTS ---
router.get('/my-appointments', verifyToken, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id })
            // 🚀 CRITICAL FIX: Deep Populate 
            // We go from Appointment -> Doctor Collection -> User Collection
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name image' // Only get what we need
                }
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- CANCEL APPOINTMENT ---
router.patch('/cancel/:id', verifyToken, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        // Ensure only the owner can cancel
        if (appointment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        appointment.status = 'Cancelled';
        await appointment.save();

        res.json({ success: true, message: "Appointment cancelled" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- MARK AS PAID (Simplified for your handlePayment function) ---
router.post('/mark-as-paid', verifyToken, async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) return res.status(404).json({ success: false, message: "Not found" });

        appointment.payment = true;
        appointment.status = 'Confirmed';
        await appointment.save();

        res.json({ success: true, message: "Payment successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. DOCTOR & ADMIN ROUTES
// ==========================================

// Fix for Doctor Appointments to show patient details
router.get('/doctor-appointments', verifyToken, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate('userId', 'name email image phone') 
            .sort({ date: 1 });
            
        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.post('/book', verifyToken, async (req, res) => {
    try {
        const { doctorId, date, slot, amount } = req.body;
        const userId = req.user.id; // From verifyToken middleware

        // 1. Basic Validation
        if (!doctorId || !date || !slot) {
            return res.status(400).json({ success: false, message: "Missing required booking details" });
        }

        // 2. Check if Doctor exists
        const doctorData = await Doctor.findById(doctorId).populate('userId');
        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // 3. Create Appointment
        // Note: Keeping date as a String if your model expects a String, 
        // or new Date(date) if your model expects a Date object.
        const newAppointment = new Appointment({
            userId,
            doctorId,
            date, 
            slot,
            amount,
            status: 'Pending',
            payment: false
        });

        await newAppointment.save();

        // 4. (Optional) Update doctor's booked slots
        // await Doctor.findByIdAndUpdate(doctorId, { $push: { slotsBooked: { date, slot } } });

        res.status(201).json({ success: true, message: "Appointment booked!" });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server error during booking" });
    }
});

    router.post('/mark-as-paid', verifyToken, isAdmin, async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required." });
        }

        // 1. Find the appointment and update payment status
        const updatedApp = await Appointment.findByIdAndUpdate(
            appointmentId,
            { 
                payment: true,
                status: 'confirmed' // Optional: auto-confirm status when paid
            },
            { new: true }
        );

        if (!updatedApp) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }

        // 2. Return success
        res.status(200).json({
            success: true,
            message: "Transaction verified successfully.",
            data: updatedApp
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
});

module.exports = router;