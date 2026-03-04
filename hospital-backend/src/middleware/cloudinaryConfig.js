// backend/middleware/cloudinaryConfig.js (Example)

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'medical_records',
    // 💡 UPDATE THIS LINE
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], 
    // 💡 ADD THIS LINE for PDF support
    resource_type: 'auto', 
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };