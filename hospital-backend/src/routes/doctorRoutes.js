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
router.post('/add-doctor', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { userId, specialization, fee, experience, qualification, about, name, email } = req.body;

        if (!req.file) return res.status(400).json({ success: false, message: "Doctor image is required" });

        const existingDoctor = await Doctor.findOne({ userId });
        if (existingDoctor) return res.status(400).json({ success: false, message: "Doctor profile already exists for this user" });

        const newDoctor = new Doctor({
            userId, name, email, specialization,
            fee, experience, qualification, about,
            image: req.file.path 
        });

        await newDoctor.save();
        await User.findByIdAndUpdate(userId, { isProfileComplete: true, role: 'doctor' });

        res.status(201).json({ success: true, message: "Doctor profile created", doctor: newDoctor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// --- ADD DOCTOR DIRECT ---
router.post('/add-doctor-direct', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, email, password, specialization, fee, qualification, about, experience } = req.body;

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
            name, email,
            password: hashedPassword,
            role: 'doctor',
            isProfileComplete: true
        });
        const savedUser = await newUser.save();

        const newDoctor = new Doctor({
            userId: savedUser._id,
            name, email, specialization,
            fee: Number(fee),
            experience: experience || "1 Year",
            qualification, about,
            image: req.file.path 
        });

        await newDoctor.save();

        res.status(201).json({ 
            success: true, 
            message: "Doctor account created and profile activated successfully!" 
        });
    } catch (error) {
        console.error("Direct Add Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// --- EDIT DOCTOR ---
// PUT /api/doctors/edit/:id
router.put('/edit/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, email, specialization, fee, experience, qualification, about } = req.body;
        const updateData = {};

        if (name)           updateData.name = name;
        if (email)          updateData.email = email;
        if (specialization) updateData.specialization = specialization;
        if (fee)            updateData.fee = Number(fee);
        if (experience)     updateData.experience = experience;
        if (qualification)  updateData.qualification = qualification;
        if (about)          updateData.about = about;
        if (req.file)       updateData.image = req.file.path;

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        // Also update name/email on the linked User account
        if (name || email) {
            const userUpdate = {};
            if (name)  userUpdate.name = name;
            if (email) userUpdate.email = email;
            await User.findByIdAndUpdate(doctor.userId, userUpdate);
        }

        res.json({ success: true, message: 'Doctor updated successfully', doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- DELETE DOCTOR ---
// DELETE /api/doctors/delete/:id
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        // Also delete the linked user account
        await User.findByIdAndDelete(doctor.userId);

        res.json({ success: true, message: 'Doctor and linked account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// ==========================================
// 2. PUBLIC: BROWSING DOCTORS
// ==========================================

// --- GET ALL DOCTORS ---
router.get('/list', async (req, res) => {
    try {
        const { specialization } = req.query;
        let filter = {};
        
        if (specialization) filter.specialization = specialization;

        const doctors = await Doctor.find(filter)
            .select('-slotsBooked')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- GET SINGLE DOCTOR BY ID ---
router.get('/get-doctor/:docId', async (req, res) => {
    try {
        const { docId } = req.params;
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

module.exports = router;