const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- 1. CREATE: Send a new inquiry (Public) ---
router.post('/send-inquiry', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const newInquiry = new Inquiry({ name, email, subject, message });
    await newInquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry saved successfully!' });
  } catch (error) {
    console.error('POST Inquiry Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// --- 2. GET ALL (Admin only) ---
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching inquiries' });
  }
});

// --- 3. UPDATE STATUS (Admin only) ---
router.patch('/update-status/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedInquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, inquiry: updatedInquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// --- 4. DELETE (Admin only) ---
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deletedInquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed' });
  }
});

// --- 5. STATS (Admin only) ---
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const stats = await Inquiry.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formattedStats = stats.map(item => ({
      month: monthNames[item._id - 1],
      inquiries: item.count
    }));

    res.status(200).json({ success: true, stats: formattedStats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating stats' });
  }
});

module.exports = router;