const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    // The source of truth for auth and basic info
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    
    // Clinical-specific data only
    specialization: { type: String, required: true },
    fee: { 
        type: Number, 
        required: true, 
        default: 50, // 👈 Set your preferred default here (e.g., 50)
        min: 0       // 👈 Prevents negative numbers
    },
    experience: { type: String, required: true },
    qualification: { type: String, required: true },
    about: { type: String },
    
    // Admin Control: Is this doctor verified to see patients?
    isApproved: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'approved' },
    
    available: { type: Boolean, default: true }, 
    slotsBooked: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);