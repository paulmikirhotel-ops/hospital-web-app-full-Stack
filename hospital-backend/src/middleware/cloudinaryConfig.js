const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ── 1. IMAGE STORAGE ──────────────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'hospital_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type:   'image',
    transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
  },
})

// ── 2. VIDEO STORAGE ──────────────────────────────────────
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'hospital_videos',
    resource_type:   'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
    transformation:  [{ quality: 'auto' }],
  },
})

// ── 3. DOCUMENT STORAGE ───────────────────────────────────
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf'
    return {
      folder:        'hospital_medical_vault',
      resource_type: isPDF ? 'raw' : 'image',
      public_id:     `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
      ...(isPDF ? {} : { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }),
    }
  },
})

// ── 4. MULTER INSTANCES ───────────────────────────────────

// Standard image upload (single)
const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG and WEBP images are allowed'), false)
  },
})

// Blog upload: cover image + up to 8 gallery images + 1 video file
const uploadBlog = multer({
  storage: {
    // Dynamic storage: route to imageStorage or videoStorage based on fieldname
    _handleFile(req, file, cb) {
      if (file.fieldname === 'videoFile') {
        videoStorage._handleFile(req, file, cb)
      } else {
        imageStorage._handleFile(req, file, cb)
      }
    },
    _removeFile(req, file, cb) {
      if (file.fieldname === 'videoFile') {
        videoStorage._removeFile(req, file, cb)
      } else {
        imageStorage._removeFile(req, file, cb)
      }
    },
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for video
  fileFilter: (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const allowedVideos = ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm', 'video/x-matroska']
    if (file.fieldname === 'videoFile') {
      allowedVideos.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only MP4, MOV, AVI, WEBM videos are allowed'), false)
    } else {
      allowedImages.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG and WEBP images are allowed'), false)
    }
  },
})

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF, JPG, PNG and WEBP files are allowed'), false)
  },
})

module.exports = { upload, uploadBlog, uploadDocument, cloudinary }