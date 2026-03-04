const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomId: { type: String, required: true }, // The unique ID for the video call
    status: { type: String, enum: ['scheduled', 'active', 'completed'], default: 'scheduled' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meeting', meetingSchema);