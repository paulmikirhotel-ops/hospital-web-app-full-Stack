const express = require('express');
const router = express.Router();
 const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');
const User = require('../models/User'); 
const { upload } = require('../middleware/cloudinaryConfig');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


// ==========================================
// 1. ADMIN: DOCTOR MANAGEMENT
// ==========================================

// --- ADD NEW DOCTOR PROFILE ---
// Linked to an existing User account via userId
router.post('/add-doctor', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { userId, specialization, fee, experience, qualification, about, name, email } = req.body;

        if (!req.file) return res.status(400).json({ success: false, message: "Doctor image is required" });

        // Check if doctor profile already exists for this user
        const existingDoctor = await Doctor.findOne({ userId });
        if (existingDoctor) return res.status(400).json({ success: false, message: "Doctor profile already exists for this user" });

        const newDoctor = new Doctor({
            userId,
            name,
            email,
            specialization,
            fee,
            experience,
            qualification,
            about,
            image: req.file.path 
        });

        await newDoctor.save();

        // 🚀 CRITICAL: Update the User model to reflect profile completion
        await User.findByIdAndUpdate(userId, { isProfileComplete: true, role: 'doctor' });

        res.status(201).json({ success: true, message: "Doctor profile created", doctor: newDoctor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// ==========================================
// 2. PUBLIC: BROWSING DOCTORS
// ==========================================

// --- GET ALL DOCTORS (With Filter Logic) ---
// backend/routes/doctorRoute.js

// --- GET ALL DOCTORS ---
router.get('/list', async (req, res) => {
    try {
        const { specialization } = req.query;
        let filter = {};
        
        if (specialization) {
            filter.specialization = specialization;
        }

        // We get the name/image from the Doctor model itself now
        const doctors = await Doctor.find(filter)
            .select('-slotsBooked')
            .sort({ createdAt: -1 }); // Newest doctors first

        res.status(200).json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- GET SINGLE DOCTOR BY ID ---
router.get('/get-doctor/:docId', async (req, res) => {
    try {
        const { docId } = req.params;
        
        // Populate userId ONLY if you need generic account info (like join date)
        const doctor = await Doctor.findById(docId).select('-slotsBooked');

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Specialist not found" });
        }

        res.status(200).json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ==========================================
// 3. DOCTOR: SELF MANAGEMENT
// ==========================================

// --- GET MY CLINICAL PROFILE ---
router.get('/me', verifyToken, async (req, res) => {
    try {
        // Find clinical data using the User ID from the token
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) return res.status(404).json({ success: false, message: "Clinical profile not found" });
        res.status(200).json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- TOGGLE AVAILABILITY ---
router.patch('/toggle-availability', verifyToken, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

        doctor.available = !doctor.available;
        await doctor.save();
        res.status(200).json({ success: true, available: doctor.available });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
   
  
router.post('/add-doctor-direct', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        // 🚀 1. ADD 'experience' TO DESTRUCTURING
        const { name, email, password, specialization, fee, qualification, about, experience } = req.body;
        

        console.log("Files received:", req.file); // If this says 'undefined', the frontend key is wrong.
    console.log("Body received:", req.body); // If this is empty, the FormData isn't sending.
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Doctor headshot is required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "This email is already registered." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'doctor',
            isProfileComplete: true
        });
        const savedUser = await newUser.save();

        // 🚀 2. ADD 'experience' TO THE DOCTOR OBJECT
        const newDoctor = new Doctor({
            userId: savedUser._id,
            name,
            email,
            specialization,
            fee: Number(fee),
            experience: experience || "1 Year", // Fallback if somehow missing
            qualification,
            about,
            image: req.file.path 
        });

        await newDoctor.save();

        res.status(201).json({ 
            success: true, 
            message: "Doctor account created and profile activated successfully!" 
        });

    } catch (error) {
        console.error("Direct Add Error:", error);
        // Change status to 400 for validation errors to help debugging
        res.status(400).json({ success: false, message: error.message });
    }
});
module.exports = router;