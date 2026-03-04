const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer'); 
const { upload } = require('../middleware/cloudinaryConfig');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ==========================================
// 1. USER & DOCTOR COMMON ROUTES
// ==========================================

// --- GET OWN PROFILE ---
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        res.status(200).json({ success: true, user }); 
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- UPDATE OWN PROFILE ---
// Note: We explicitly exclude 'role' and 'email' from updates for security
router.post('/update-profile', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { name, phone, address, gender, dob } = req.body;
        const userId = req.user.id;

        // Build update object safely
        let updateData = { name, phone, address, gender, dob };
        
        // If a new image was uploaded via Cloudinary
        if (req.file) {
            updateData.image = req.file.path; 
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: updateData }, 
            { new: true, runValidators: true } 
        ).select('-password');

        res.json({ 
            success: true, 
            message: "Profile Updated Successfully", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- DELETE OWN ACCOUNT ---
router.delete('/delete-account', verifyToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });

        // Clear the auth cookie upon deletion
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. ADMIN ONLY ROUTES (Superuser Control)
// ==========================================

// --- GET ALL REGISTERED USERS ---
router.get('/all-users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- ADMIN DELETE ANY USER ---
router.delete('/admin-delete/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        res.json({ success: true, message: "User account removed by Admin" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- ADMIN UPDATE ANY USER ROLE ---
router.patch('/change-role/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { role }, 
            { new: true }
        ).select('-password');
        
        res.json({ success: true, message: "Role updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 3. GLOBAL ERROR HANDLING (Multer)
// ==========================================

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: "Image upload error: " + error.message });
    }
    res.status(500).json({ success: false, message: error.message });
});

module.exports = router;