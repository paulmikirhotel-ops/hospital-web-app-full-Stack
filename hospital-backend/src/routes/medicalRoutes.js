const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { upload } = require('../middleware/cloudinaryConfig');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/medical-records/upload
 * @desc    Upload a lab result or prescription (Patient/Doctor Only)
 */
router.post('/upload', verifyToken, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No document provided" });

        // Normalize the role string (e.g., "patient" -> "Patient")
        const rawRole = req.user.role || 'Patient';
        const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

        const record = new MedicalRecord({
            userId: req.user.id, 
            title: req.body.title,
            documentUrl: req.file.path,
            category: req.body.category || 'Other',
            uploadedBy: formattedRole, // 💡 Now matches ['Patient', 'Admin', 'Doctor']
            fileSize: (req.file.size / 1024).toFixed(2) + " KB",
            fileType: req.file.mimetype // Good practice to include this
        });

        await record.save();
        res.status(201).json({ success: true, record });
    } catch (error) {
        // Log the error for debugging
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/medical-records/my-vault
 * @desc    Get all records for the logged-in patient
 */
router.get('/my-vault', verifyToken, async (req, res) => {
    try {
        const records = await MedicalRecord.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   DELETE /api/medical-records/:id
 * @desc    Delete a record (Owner Only)
 */
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const record = await MedicalRecord.findOne({ _id: req.params.id, userId: req.user.id });
        if (!record) return res.status(404).json({ message: "Record not found or unauthorized" });

        await MedicalRecord.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Record removed from vault" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;