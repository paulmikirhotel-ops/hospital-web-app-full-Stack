const express = require('express');
const router  = express.Router();
const Blog    = require('../models/Blog');
const { uploadBlog, upload } = require('../middleware/cloudinaryConfig');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Helper: detect video URL type
const detectVideoType = (url = '') => {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('cloudinary.com')) return 'cloudinary';
  return '';
};

// Blog upload fields config
const blogUploadFields = uploadBlog.fields([
  { name: 'coverImg',  maxCount: 1 },
  { name: 'images',    maxCount: 8 },
  { name: 'videoFile', maxCount: 1 },
]);

// ── 1. CREATE POST ────────────────────────────────────────
router.post('/', verifyToken, blogUploadFields, async (req, res) => {
  try {
    const { title, description, content, category, videoUrl } = req.body;

    if (!title || !description)
      return res.status(400).json({ success: false, message: 'Title and description are required' });

    const coverImg  = req.files?.coverImg?.[0]?.path  || '';
    const images    = (req.files?.images  || []).map(f => f.path);
    const videoFile = req.files?.videoFile?.[0]?.path || '';

    // Video: prefer uploaded file, fall back to pasted URL
    const video     = videoFile || videoUrl || '';
    const videoType = videoFile ? 'cloudinary' : detectVideoType(videoUrl);

    const newPost = new Blog({
      title, description, content, coverImg,
      images, video, videoType,
      author: req.user.id, category,
    });

    await newPost.save();
    res.status(201).json({ success: true, message: 'Blog post created!', post: newPost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message });
  }
});

// ── 2. GET ALL POSTS ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find()
      .populate('author', 'name email image')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── 3. GET SINGLE POST ────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'name email image');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── 4. UPDATE POST ────────────────────────────────────────
router.put('/:id', verifyToken, blogUploadFields, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Unauthorized' });

    const { title, description, content, category, videoUrl, existingImages } = req.body;

    const coverImg  = req.files?.coverImg?.[0]?.path  || req.body.coverImg || blog.coverImg;
    const newImages = (req.files?.images || []).map(f => f.path);
    const videoFile = req.files?.videoFile?.[0]?.path || '';

    // Merge kept existing images + newly uploaded images (max 8)
    let keptImages = [];
    if (existingImages) {
      keptImages = Array.isArray(existingImages) ? existingImages : [existingImages];
    }
    const images = [...keptImages, ...newImages].slice(0, 8);

    const video     = videoFile || videoUrl || blog.video || '';
    const videoType = videoFile ? 'cloudinary' : detectVideoType(video);

    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, category, content, coverImg, images, video, videoType } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Post updated!', post: updatedPost });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
});

// ── 5. DELETE POST ────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Unauthorized' });

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
});

// ── 6. BLOG COUNT ─────────────────────────────────────────
router.get('/count', verifyToken, isAdmin, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting blogs' });
  }
});

module.exports = router;