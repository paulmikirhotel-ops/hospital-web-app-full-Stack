const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { upload } = require('../middleware/cloudinaryConfig');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- 1. CREATE POST ---
router.post('/', verifyToken, upload.single('coverImg'), async (req, res) => {
  try {
    const { title, description, content, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const coverImgPath = req.file ? req.file.path : '';

    const newPost = new Blog({
      title,
      description,
      content,
      coverImg: coverImgPath,
      author: req.user.id,
      category
    });

    await newPost.save();
    res.status(201).json({ success: true, message: 'Blog post created!', post: newPost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message });
  }
});

// --- 2. GET ALL POSTS (Public) ---
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

// --- 3. GET SINGLE POST (Public) ---
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'name email image');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 4. UPDATE POST ---
// ✅ FIX: Added upload.single('coverImg') to handle multipart/form-data
router.put('/:id', verifyToken, upload.single('coverImg'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, description, content, category } = req.body;

    // If new file uploaded use Cloudinary URL, otherwise keep existing URL from body
    const coverImg = req.file ? req.file.path : req.body.coverImg;

    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, category, content, coverImg } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Post updated!', post: updatedPost });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
});

// --- 5. DELETE POST ---
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
});

// --- 6. GET BLOG COUNT ---
router.get('/count', verifyToken, isAdmin, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting blogs' });
  }
});

module.exports = router;