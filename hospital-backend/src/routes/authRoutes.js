const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 🚀 FIX: Update these to point to your NEW consolidated middleware file
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- 1. REGISTER USER ---
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        
        // 1. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already in use" });

        // 2. Create User with correct role
        // Default to 'user' (patient) if no role is provided
        const user = new User({ 
            email, 
            password, 
            name, 
            role: role || 'user', 
            // Doctors start with an incomplete profile
            isProfileComplete: role === 'doctor' ? false : true 
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: "Registration successful!",
            user: { _id: user._id, role: user.role, name: user.name }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 2. LOGIN USER ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { 
                _id: user._id, 
                email: user.email, 
                name: user.name, 
                role: user.role, 
                image: user.image,
                isProfileComplete: user.isProfileComplete 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login error" });
    }
});

// --- 3. VERIFY AUTH STATUS (/me) ---
// We now use verifyToken to handle the heavy lifting
router.get('/me', verifyToken, async (req, res) => {
    try {
        console.log("Searching for User ID from token:", req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true,
            user: { 
                _id: user._id, 
                email: user.email, 
                name: user.name, 
                role: user.role, 
                image: user.image,
                isProfileComplete: user.isProfileComplete 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error checking session" });
    }
});

// --- 4. LOGOUT ---
// This stops the "Disconnecting session..." hanging
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
});
  
// GET /api/auth/users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        // Find users who are doctors but haven't finished their profile
        const users = await User.find({ 
            role: 'doctor', 
            isProfileComplete: false 
        }).select('name email _id');

        res.status(200).json(users); // Return the array directly
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
});
  // server/routes/authRoutes.js

// GET /api/auth/available-for-promotion
// server/routes/authRoutes.js

router.get('/available-for-promotion', verifyToken, isAdmin, async (req, res) => {
    try {
        // 🚀 Find users who are EITHER 'user' or 'patient'
        const users = await User.find({ 
            role: { $in: ['user', 'patient'] }, 
            isProfileComplete: { $ne: true } 
        }).select('name email role _id');

        console.log(`System found ${users.length} eligible accounts.`);

        res.status(200).json({ 
            success: true, 
            count: users.length,
            users 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching users" });
    }
});

module.exports = router;