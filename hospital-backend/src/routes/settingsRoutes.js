const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Settings = require('../models/Settings');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/cloudinaryConfig');
const bcrypt = require('bcryptjs');

// ================================================
// PROFILE SETTINGS
// ================================================

router.get('/profile', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/profile', verifyToken, isAdmin, upload.single('avatar'), async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (req.file) updateData.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/change-password', verifyToken, isAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both fields are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================================================
// SITE / HOSPITAL SETTINGS
// ================================================

router.get('/site', verifyToken, isAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/site', verifyToken, isAdmin, upload.single('logo'), async (req, res) => {
  try {
    const { hospitalName, email, phone, address, website } = req.body;
    const updateData = {};
    if (hospitalName) updateData.hospitalName = hospitalName;
    if (email)        updateData.email = email;
    if (phone)        updateData.phone = phone;
    if (address)      updateData.address = address;
    if (website)      updateData.website = website;
    if (req.file)     updateData.logo = req.file.path;

    const settings = await Settings.findOneAndUpdate({}, updateData, { new: true, upsert: true });
    res.json({ success: true, message: 'Site settings updated', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================================================
// USER MANAGEMENT
// ================================================

router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'doctor', 'patient'].includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });
    if (req.params.id === req.user.id)
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================================================
// NOTIFICATION SETTINGS
// ================================================

router.get('/notifications', verifyToken, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({ success: true, notifications: settings?.notifications || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/notifications', verifyToken, isAdmin, async (req, res) => {
  try {
    const { emailOnAppointment, emailOnNewUser, emailOnPayment, smsAlerts, pushAlerts } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      { notifications: { emailOnAppointment, emailOnNewUser, emailOnPayment, smsAlerts, pushAlerts } },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Notification settings updated', notifications: settings.notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;