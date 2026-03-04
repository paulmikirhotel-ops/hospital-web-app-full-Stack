const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true }, 
    slot: { type: String, required: true }, 
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
        default: 'Pending' 
    },
    amount: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    // --- NEW CLINICAL FIELDS ---
    patientNotes: { type: String, default: "" }, // Doctor's post-session notes
    isReviewed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);