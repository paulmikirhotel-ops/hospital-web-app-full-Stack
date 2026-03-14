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
        trim: true
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
        enum: ['Patient', 'Admin', 'Doctor'],
        default: 'Patient' 
    },
    fileType: { 
        type: String, 
        default: 'application/pdf' 
    },
    fileSize: { 
        type: String 
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Flagged'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);