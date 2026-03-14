const express  = require('express');
const router   = express.Router();
const Service  = require('../models/Service');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/cloudinaryConfig');

// GET all services
router.get('/list', async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add new service (admin only)
router.post('/add', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Service image is required' });
    const { title, description, category } = req.body;
    const service = new Service({
      title,
      description,
      category,
      image: req.file.path,
      isAvailable: true
    });
    await service.save();
    res.status(201).json({ success: true, message: 'New service added', service });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update service (admin only)
router.put('/update/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title:       req.body.title,
      description: req.body.description,
      isAvailable: req.body.isAvailable,
    };
    if (req.file) updateData.image = req.file.path;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedService) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service updated', service: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH toggle availability (admin only)
router.patch('/toggle-status/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    service.isAvailable = !service.isAvailable;
    await service.save();
    res.json({ success: true, isAvailable: service.isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE service (admin only)
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;