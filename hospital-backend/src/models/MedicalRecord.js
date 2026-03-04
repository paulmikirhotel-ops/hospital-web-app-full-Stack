const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true,
        trim: true // 💡 Removes accidental whitespace
    }, 
    documentUrl: { 
        type: String, 
        required: true 
    }, 
    category: { 
        type: String, 
        enum: ['Lab Result', 'Prescription', 'X-Ray', 'Vaccination', 'Other'], 
        default: 'Other' 
    },
    uploadedBy: { 
        type: String, 
        // 💡 FIX: Added lowercase versions or change logic to lowercase
        enum: ['Patient', 'Admin', 'Doctor', 'patient', 'admin', 'doctor'], 
        default: 'Patient' 
    },
    fileType: { 
        type: String, 
        default: 'application/pdf' 
    },
    fileSize: { 
        type: String 
    },
    // 💡 IMPROVEMENT: Add a status field for clinical review
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Flagged'],
        default: 'Pending'
    }
}, { timestamps: true });

// Optional: Force lowercase before saving to avoid this ever happening again
medicalRecordSchema.pre('save', function(next) {
    if (this.uploadedBy) {
        this.uploadedBy = this.uploadedBy.charAt(0).toUpperCase() + this.uploadedBy.slice(1).toLowerCase();
    }
    next();
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);