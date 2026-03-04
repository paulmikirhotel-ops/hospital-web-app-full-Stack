const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['Appointment', 'Medical Record', 'System', 'Billing'], 
        default: 'System' 
    },
    isRead: { type: Boolean, default: false },
    link: { type: String } // Optional: URL to redirect the user (e.g., /medical-vault)
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);