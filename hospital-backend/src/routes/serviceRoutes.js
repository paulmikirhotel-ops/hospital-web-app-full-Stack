const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/cloudinaryConfig');


router.post('/add', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        // 1. Check if the image was successfully uploaded by Multer
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Service image is required" });
        }

        // 2. Extract text fields from req.body
        const { title, description, category } = req.body;

        // 3. Create the Service using text from body and URL from Multer
        const service = new Service({
            title,
            description,
            category,
            image: req.file.path, // 🚀 This is the Cloudinary URL
            isAvailable: true
        });

        await service.save();
        res.status(201).json({ success: true, message: "New service added", service });

    } catch (error) {
        console.error("Backend Crash Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to add service", 
            error: error.message 
        });
    }
});
/**
 * @route    GET /api/services/:id
 * @desc     Get details of a single service (The missing link!)
 */
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.json({ success: true, service });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

/**
 * @route    PATCH /api/services/:id
 * @desc     Update service details (Admin Only)
 */
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        if (!updatedService) return res.status(404).json({ message: "Service not found" });
        res.json({ success: true, message: "Service updated", service: updatedService });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route    DELETE /api/services/:id
 */
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.json({ success: true, message: "Service removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;