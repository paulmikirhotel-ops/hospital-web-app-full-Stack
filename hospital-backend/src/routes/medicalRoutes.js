const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { uploadDocument } = require('../middleware/cloudinaryConfig');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- UPLOAD DOCUMENT ---
// POST /api/medical-vault/upload
router.post('/upload', verifyToken, uploadDocument.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document provided' });
    }
    if (!req.body.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const rawRole = req.user.role || 'patient';
    const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

    const record = new MedicalRecord({
      userId:      req.user.id,
      title:       req.body.title,
      documentUrl: req.file.path,
      category:    req.body.category || 'Other',
      uploadedBy:  formattedRole,
      fileSize:    (req.file.size / 1024).toFixed(2) + ' KB',
      fileType:    req.file.mimetype
    });

    await record.save();
    res.status(201).json({ success: true, record });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

console.log('uploadDocument:', uploadDocument); // Add this line
console.log('uploadDocument.single:', uploadDocument?.single);

// --- GET OWN VAULT ---
// GET /api/medical-vault/my-vault
router.get('/my-vault', verifyToken, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- DELETE A RECORD ---
// DELETE /api/medical-vault/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found or unauthorized' });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record removed from vault' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- ADMIN: GET ALL RECORDS ---
// GET /api/medical-vault/admin/all
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;