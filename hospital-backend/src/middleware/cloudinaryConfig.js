const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// ============================================
// CLOUDINARY CREDENTIALS
// ============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ============================================
// 1. IMAGE STORAGE
// For: profile photos, blog covers, service icons, doctor photos
// ============================================
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'hospital_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type:   'image',
    transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
  },
})

// ============================================
// 2. DOCUMENT STORAGE
// For: medical vault — PDFs and images
// ============================================
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf'
    return {
      folder:        'hospital_medical_vault',
      resource_type: isPDF ? 'raw' : 'image',
      public_id:     `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
      ...(isPDF
        ? {}
        : { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }
      ),
    }
  },
})

// ============================================
// 3. MULTER INSTANCES
// ============================================
const upload         = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG, PNG and WEBP images are allowed'), false)
    }
  }
})

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for documents
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF, JPG, PNG and WEBP files are allowed'), false)
    }
  }
})

// ============================================
// 4. EXPORTS
// ============================================
module.exports = { upload, uploadDocument, cloudinary }