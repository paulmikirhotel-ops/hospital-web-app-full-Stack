const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    image: { type: String }, // Cloudinary URL for the service icon
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Service', serviceSchema);