const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { createNotification } = require('./notificationRoutes');

/* ── HELPER ───────────────────────────────────────────────────── */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);


// ============================================================
// 1. PATIENT ROUTES
// ============================================================

/**
 * GET /api/appointments/my-appointments
 * Fetch all appointments for the logged-in patient
 */
router.get('/my-appointments', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name image',
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('GET /my-appointments error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * POST /api/appointments/book
 * Book a new appointment
 */
router.post('/book', verifyToken, async (req, res) => {
  try {
    const { doctorId, date, slot, amount } = req.body;
    const userId = req.user.id;

    // 1. Validate required fields
    if (!doctorId || !date || !slot) {
      return res.status(400).json({
        success: false,
        message: 'doctorId, date, and slot are all required.',
      });
    }

    // 2. Validate doctorId format
    if (!isValidId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID.' });
    }

    // 3. Check doctor exists
    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // 4. Check slot is not already taken
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      slot,
      status: { $nin: ['Cancelled'] },
    });
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked. Please choose another time.',
      });
    }

    // 5. Create the appointment
    const appointment = await Appointment.create({
      userId,
      doctorId,
      date,
      slot,
      amount: amount || 0,
      status: 'Pending',
      payment: false,
    });

    // 6. Notify the patient
    await createNotification(
      userId,
      `Your appointment with Dr. ${doctor.userId?.name || 'your doctor'} on ${date} at ${slot} is pending confirmation.`,
      'Appointment',
      '/my-appointments'
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment,
    });
  } catch (error) {
    console.error('POST /book error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during booking.' });
  }
});


/**
 * PATCH /api/appointments/cancel/:id
 * Patient cancels their own appointment
 */
router.patch('/cancel/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Only the owner can cancel
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    // Can't cancel what's already cancelled
    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled.' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    // Notify the patient
    await createNotification(
      req.user.id,
      `Your appointment on ${appointment.date} at ${appointment.slot} has been cancelled.`,
      'Appointment',
      '/my-appointments'
    );

    res.json({ success: true, message: 'Appointment cancelled.' });
  } catch (error) {
    console.error('PATCH /cancel/:id error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * POST /api/appointments/mark-as-paid  (PATIENT)
 * Patient self-pay — no admin required
 */
router.post('/mark-as-paid', verifyToken, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'appointmentId is required.' });
    }
    if (!isValidId(appointmentId)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Only the owner can pay
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (appointment.payment) {
      return res.status(400).json({ success: false, message: 'Already paid.' });
    }

    appointment.payment = true;
    appointment.status = 'Confirmed';
    await appointment.save();

    // Notify the patient
    await createNotification(
      req.user.id,
      `Payment confirmed! Your appointment on ${appointment.date} at ${appointment.slot} is now confirmed.`,
      'Billing',
      '/my-appointments'
    );

    res.json({ success: true, message: 'Payment successful. Appointment confirmed.' });
  } catch (error) {
    console.error('POST /mark-as-paid (patient) error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ============================================================
// 2. DOCTOR ROUTES
// ============================================================

/**
 * GET /api/appointments/doctor-appointments
 * Doctor fetches their own appointment list
 */
router.get('/doctor-appointments', verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('userId', 'name email image phone')
      .sort({ date: 1 })
      .lean();

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('GET /doctor-appointments error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * PATCH /api/appointments/confirm/:id
 * Doctor confirms a pending appointment
 */
router.patch('/confirm/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctorId: doctor._id },
      { status: 'Confirmed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Notify the patient
    await createNotification(
      appointment.userId,
      `Your appointment on ${appointment.date} at ${appointment.slot} has been confirmed by your doctor.`,
      'Appointment',
      '/my-appointments'
    );

    res.json({ success: true, message: 'Appointment confirmed.', appointment });
  } catch (error) {
    console.error('PATCH /confirm/:id error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ============================================================
// 3. ADMIN ROUTES
// ============================================================

/**
 * GET /api/appointments/all
 * Admin fetches all appointments across all users
 */
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('GET /all error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * POST /api/appointments/admin/mark-as-paid
 * Admin manually verifies and marks an appointment as paid
 */
router.post('/admin/mark-as-paid', verifyToken, isAdmin, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'appointmentId is required.' });
    }
    if (!isValidId(appointmentId)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { payment: true, status: 'Confirmed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Notify the patient
    await createNotification(
      appointment.userId,
      `Your payment for the appointment on ${appointment.date} at ${appointment.slot} has been verified by admin.`,
      'Billing',
      '/my-appointments'
    );

    res.json({
      success: true,
      message: 'Transaction verified successfully.',
      data: appointment,
    });
  } catch (error) {
    console.error('POST /admin/mark-as-paid error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;