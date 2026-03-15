const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── Direct fields (fixes name/image not showing) ──
  name:           { type: String, required: true },
  email:          { type: String, required: true },
  image:          { type: String, default: '' },

  // ── Clinical data ──
  specialization: { type: String, required: true },
  fee:            { type: Number, required: true, default: 50, min: 0 },
  experience:     { type: String, required: true },
  qualification:  { type: String, required: true },
  about:          { type: String, default: '' },

  isApproved:     { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'approved' },
  available:      { type: Boolean, default: true },
  slotsBooked:    { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);