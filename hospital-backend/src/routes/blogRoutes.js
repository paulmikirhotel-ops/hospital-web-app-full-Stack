const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { upload } = require('../middleware/cloudinaryConfig'); 
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // 🚀 ADDED

// --- 1. CREATE POST (Secured) ---
router.post('/create-post', verifyToken, upload.single('coverImg'), async (req, res) => {
    try {
        const { title, description, content, category } = req.body;
        
        // Use req.user.id from the token so no one can fake the author
        const authorId = req.user.id; 

        const coverImgPath = req.file ? req.file.path : '';

        const newPost = new Blog({
            title,
            description,
            content, 
            coverImg: coverImgPath,
            author: authorId, // 🛡️ Secured
            category
        });

        await newPost.save();
        res.status(201).json({ success: true, message: "Blog post created!", post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create post", error: error.message });
    }
});

// --- 2. GET ALL POSTS (Public) ---
// --- 2. GET ALL POSTS (Public) ---
router.get('/', async (req, res) => {
    try {
        // 🚀 DB-LEVEL SORT: .sort({ createdAt: -1 }) gets newest first automatically
        const posts = await Blog.find()
            .populate('author', 'name email image')
            .sort({ createdAt: -1 });
            
        // Standardized response
        res.status(200).json({ 
            success: true, 
            posts: posts // Sending the array under the 'posts' key
        }); 
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 3. GET SINGLE POST (Public) ---
router.get('/:id', async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id).populate('author', 'name email image');
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });
        
        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 4. UPDATE POST (Secured) ---
router.put('/update-post/:id', verifyToken, upload.single('coverImg'), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: "Post not found" });

        // 🛡️ SECURITY: Only the Author or an Admin can update
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { title, description, content, category } = req.body;
        let updateData = { title, description, category, content };

        if (req.file) updateData.coverImg = req.file.path;

        const updatedPost = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Post updated!", post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed", error: error.message });
    }
});

// --- 5. DELETE POST (Secured: Admin Only or Author Only) ---
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: "Post not found" });

        // 🛡️ SECURITY check
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed", error: error.message });
    }
});
  

// GET total blog count
router.get('/count', verifyToken, isAdmin, async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        
        res.status(200).json({
            success: true,
            count: totalBlogs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error counting blogs" });
    }
});
  // server/routes/adminRoutes.js

router.get('/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        // 1. Fetch counts and recent data in parallel
        const [
            totalAppointments,
            totalDoctors,
            totalBlogs,
            totalServices,
            totalPatients,
            recentActivity,
            recentBlogs // 🚀 THE NEW ADDITION
        ] = await Promise.all([
            Appointment.countDocuments(),
            Doctor.countDocuments(),
            Blog.countDocuments(),
            Service.countDocuments(),
            User.countDocuments({ role: 'patient' }),
            
            // Fetch last 10 appointments with user/doctor details
            Appointment.find()
                .populate('userId', 'name')
                .populate('doctorId', 'name')
                .sort({ createdAt: -1 })
                .limit(10),
            
            // 🚀 THE NEW ADDITION: Fetch last 4 blog posts
            Blog.find()
                .select('title createdAt')
                .sort({ createdAt: -1 })
                .limit(4)
        ]);

        // 2. Calculate Total Revenue
        const revenueData = await Appointment.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // 3. Send everything to the frontend
        res.status(200).json({
            success: true,
            stats: {
                revenue: revenueData[0]?.total || 0,
                totalAppointments,
                doctors: totalDoctors,
                blogs: totalBlogs,
                services: totalServices,
                patients: totalPatients
            },
            recentActivity,
            recentBlogs // 🚀 Received by your AdminDashboard state
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
module.exports = router;