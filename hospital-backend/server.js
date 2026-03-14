const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// 1. IMPORT ROUTERS
const authRoutes = require('./src/routes/authRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const medicalRoutes = require('./src/routes/medicalRoutes'); 
const adminRouter = require('./src/routes/adminRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const meetingRoutes = require('./src/routes/meetingRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes'); // 🆕 Added
const commentRoutes = require('./src/routes/commentRoutes'); // 🆕 Added
const inquiryRoutes = require('./src/routes/inquiryRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');

const app = express();

// --- 2. CORS CONFIGURATION ---
app.use(cors({
  // Tip: In production, change this to your actual domain
  origin: ['http://localhost:5174',
           'http://localhost:5173',
           'https://hospital-web-app-8slq.onrender.com',         // ✅ your frontend
           'https://hospital-web-app-full-stack-1.onrender.com', // ✅ your backend

         ], 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// --- 3. MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving (Useful if you still store some local assets)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. DATABASE CONNECTION ---
// Set strictQuery to suppress Mongoose 7 warnings
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ SJCH Hospital DB Connected'))
  .catch(err => console.error('❌ DB Error:', err.message));

// --- 5. MOUNT ROUTER PATHS ---
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes); 
app.use('/api/medical-vault', medicalRoutes); 
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes); // 🆕 Mounted
app.use('/api/comments', commentRoutes); // 🆕 Mounted
app.use('/api/inquiries', inquiryRoutes); // 🆕 Mounted
app.use('/api/settings', settingsRoutes);

// --- 6. HEALTH CHECK (Optional but recommended) ---
app.get('/', (req, res) => {
    res.send("SJCH Hospital API is running...");
});

// --- 7. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(err.status || 500).json({ 
      success: false,
      message: err.message || "Internal Server Error"
    });
});

// --- 8. LISTEN ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 SJCH Server live on http://localhost:${PORT}`);
});