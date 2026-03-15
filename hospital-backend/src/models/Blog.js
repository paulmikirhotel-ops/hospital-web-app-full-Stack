const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  content:     { type: String, required: true },
  coverImg:    { type: String, default: '' },
  images:      [{ type: String }],   // up to 8 gallery images
  video:       { type: String, default: '' },   // Cloudinary URL or YouTube/Vimeo URL
  videoType:   { type: String, enum: ['cloudinary', 'youtube', 'vimeo', ''], default: '' },
  category:    { type: String, default: 'Health' },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);