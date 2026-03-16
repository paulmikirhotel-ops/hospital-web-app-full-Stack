const mongoose = require('mongoose');

const loginActivitySchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:      { type: String, default: 'user' },
  loginAt:   { type: Date,   default: Date.now },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
}, { timestamps: false });

// Index for fast queries
loginActivitySchema.index({ loginAt: -1 });
loginActivitySchema.index({ userId: 1 });
loginActivitySchema.index({ role: 1 });

module.exports = mongoose.model('LoginActivity', loginActivitySchema);