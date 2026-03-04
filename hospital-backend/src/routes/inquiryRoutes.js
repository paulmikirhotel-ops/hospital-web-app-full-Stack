const express = require('express');
const router = express.Router();
const Inquiry = require('../models/inquiry'); // Ensure this matches your lowercase filename
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- 1. CREATE: Send a new inquiry (Public) ---
router.post('/send-inquiry', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic Validation Safety
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const newInquiry = new Inquiry({ name, email, subject, message });
        await newInquiry.save();
        res.status(201).json({ success: true, message: "Inquiry saved successfully!" });
    } catch (error) {
        console.error("POST Inquiry Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// --- 2. READ: Get all inquiries (Admin only) ---
router.get('/all', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        // 🚀 UPDATE: Wrap in an object so your AdminDashboard can map data.inquiries
        res.status(200).json({ success: true, inquiries }); 
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching inquiries" });
    }
});

// --- 3. UPDATE: Mark as read/replied (Admin only) ---
router.patch('/update-status/:id', async (req, res) => {
    try {
        const { status } = req.body; 
        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        
        if (!updatedInquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
        
        res.status(200).json({ success: true, inquiry: updatedInquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
});

// --- 4. DELETE: Remove an inquiry (Admin only) ---
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!deletedInquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
        
        res.status(200).json({ success: true, message: "Inquiry deleted forever" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Deletion failed" });
    }
});

// --- 5. ANALYTICS: Get inquiries count per month ---
router.get('/stats', async (req, res) => {
    try {
        const stats = await Inquiry.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedStats = stats.map(item => ({
            month: monthNames[item._id - 1],
            inquiries: item.count
        }));

        res.status(200).json({ success: true, stats: formattedStats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error generating stats" });
    }
});
// Add this to your Admin-specific routes
router.get('/admin-stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
        const totalDoctors = await Doctor.countDocuments();
        
        // This is likely what your AdminLayout is looking for:
        const inquiryCount = await Appointment.countDocuments({ status: 'Pending' });

        res.json({ 
            success: true, 
            stats: {
                totalAppointments,
                pendingAppointments,
                totalDoctors,
                inquiryCount // 🚀 THE FIX: This satisfies the frontend call
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;