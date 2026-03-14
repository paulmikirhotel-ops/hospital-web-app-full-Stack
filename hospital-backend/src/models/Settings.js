const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  hospitalName: { type: String, default: 'SJCH Hospital' },
  email:        { type: String, default: '' },
  phone:        { type: String, default: '' },
  address:      { type: String, default: '' },
  website:      { type: String, default: '' },
  logo:         { type: String, default: '' },
  notifications: {
    emailOnAppointment: { type: Boolean, default: true },
    emailOnNewUser:     { type: Boolean, default: true },
    emailOnPayment:     { type: Boolean, default: true },
    smsAlerts:          { type: Boolean, default: false },
    pushAlerts:         { type: Boolean, default: false },
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);