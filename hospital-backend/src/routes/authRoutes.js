const express       = require('express');
const router        = express.Router();
const User          = require('../models/User');
const Doctor        = require('../models/Doctor');
const jwt           = require('jsonwebtoken');
const crypto        = require('crypto');
const nodemailer    = require('nodemailer');
const LoginActivity = require('../models/LoginActivity');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/* ─────────────────────────────────────────────
   EMAIL TRANSPORTER
   ─ Local  : set MAILTRAP_USER + MAILTRAP_PASS in .env
   ─ Prod   : uses Gmail (GMAIL_USER + GMAIL_APP_PASSWORD)
───────────────────────────────────────────── */
const isMailtrap = process.env.MAILTRAP_USER && process.env.NODE_ENV !== 'production';

const transporter = nodemailer.createTransport(
  isMailtrap
    ? {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      }
    : {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      }
);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"St. Joseph's Catholic Hospital" <${
        isMailtrap ? process.env.MAILTRAP_USER : process.env.GMAIL_USER
      }>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

/* ─────────────────────────────────────────────
   EMAIL TEMPLATES
───────────────────────────────────────────── */
const forgotPasswordEmail = (name, resetUrl) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8faff;padding:40px 20px;">
    <div style="background:#fff;border-radius:24px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="color:#0f172a;font-size:28px;font-weight:900;margin:0;">St. Joseph's Catholic Hospital</h1>
        <p style="color:#64748b;font-size:14px;margin-top:8px;">Password Reset Request</p>
      </div>
      <p style="color:#334155;font-size:16px;">Hi <strong>${name}</strong>,</p>
      <p style="color:#334155;font-size:15px;line-height:1.6;">
        We received a request to reset your password. Click the button below to create a new password.
        This link expires in <strong>1 hour</strong>.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}"
           style="display:inline-block;padding:14px 32px;background:#2563eb;color:#fff;
                  font-weight:900;font-size:14px;text-decoration:none;border-radius:14px;
                  letter-spacing:0.05em;">
          Reset My Password
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;text-align:center;">
        If you didn't request this, you can safely ignore this email.
        This link will expire in 1 hour.
      </p>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
      <p style="color:#94a3b8;font-size:12px;text-align:center;">
        St. Joseph's Catholic Hospital &middot; Old Road, Congo Town, Monrovia, Liberia
      </p>
    </div>
  </div>
`;

const doctorWelcomeEmail = (name, email, setupUrl) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8faff;padding:40px 20px;">
    <div style="background:#fff;border-radius:24px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="color:#0f172a;font-size:28px;font-weight:900;margin:0;">Welcome to SJCH Portal</h1>
        <p style="color:#64748b;font-size:14px;margin-top:8px;">Your Doctor Account is Ready</p>
      </div>
      <p style="color:#334155;font-size:16px;">Dear <strong>Dr. ${name}</strong>,</p>
      <p style="color:#334155;font-size:15px;line-height:1.6;">
        Your specialist account at St. Joseph's Catholic Hospital has been created by the admin.
        Please click the button below to set your password and activate your account.
      </p>
      <div style="background:#f0f9ff;border-radius:16px;padding:20px;margin:24px 0;">
        <p style="color:#0369a1;font-size:13px;font-weight:700;margin:0 0 8px;">Your Login Details:</p>
        <p style="color:#0f172a;font-size:14px;margin:0;"><strong>Email:</strong> ${email}</p>
        <p style="color:#64748b;font-size:13px;margin:8px 0 0;">Password: Set by you via the link below</p>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${setupUrl}"
           style="display:inline-block;padding:14px 32px;background:#0f172a;color:#fff;
                  font-weight:900;font-size:14px;text-decoration:none;border-radius:14px;
                  letter-spacing:0.05em;">
          Set My Password &amp; Activate Account
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;text-align:center;">
        This link expires in <strong>48 hours</strong>.
        Contact admin if you need a new link.
      </p>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
      <p style="color:#94a3b8;font-size:12px;text-align:center;">
        St. Joseph's Catholic Hospital &middot; Old Road, Congo Town, Monrovia, Liberia
      </p>
    </div>
  </div>
`;

/* ─────────────────────────────────────────────
   1. REGISTER
───────────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = new User({
      email, password, name,
      role: role || 'user',
      isProfileComplete: role === 'doctor' ? false : true,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: { _id: user._id, role: user.role, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ─────────────────────────────────────────────
   2. LOGIN (with activity tracking)
───────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge:   24 * 60 * 60 * 1000,
    });

    // ── Track login (non-blocking) ──
    try {
      await LoginActivity.create({
        userId:    user._id,
        role:      user.role,
        event:     'login',
        loginAt:   new Date(),
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
        userAgent: req.headers['user-agent'] || '',
      });
    } catch (trackErr) {
      console.error('Login tracking error:', trackErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id:               user._id,
        email:             user.email,
        name:              user.name,
        role:              user.role,
        image:             user.image,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login error' });
  }
});

/* ─────────────────────────────────────────────
   3. ME — verify auth status
───────────────────────────────────────────── */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({
      success: true,
      user: {
        _id:               user._id,
        email:             user.email,
        name:              user.name,
        role:              user.role,
        image:             user.image,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking session' });
  }
});

/* ─────────────────────────────────────────────
   4. LOGOUT (with activity tracking)
   ─ verifyToken added so we know who is logging out
───────────────────────────────────────────── */
router.post('/logout', verifyToken, async (req, res) => {
  // Track logout — non-blocking, never fails the request
  try {
    const user = await User.findById(req.user.id).select('role');
    if (user) {
      await LoginActivity.create({
        userId:    req.user.id,
        role:      user.role,
        event:     'logout',
        loginAt:   new Date(),
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
        userAgent: req.headers['user-agent'] || '',
      });
    }
  } catch (trackErr) {
    console.error('Logout tracking error:', trackErr.message);
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/* ─────────────────────────────────────────────
   5. FORGOT PASSWORD
   POST /api/auth/forgot-password
───────────────────────────────────────────── */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const resetToken  = crypto.randomBytes(32).toString('hex');
    const resetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken  = resetToken;
    user.resetPasswordExpiry = resetExpiry;
    await user.save();

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl     = `${FRONTEND_URL}/reset-password/${resetToken}`;

    const sent = await sendEmail({
      to:      email,
      subject: 'Reset Your Password — SJCH Portal',
      html:    forgotPasswordEmail(user.name, resetUrl),
    });

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again or contact support.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Error sending reset email.' });
  }
});

/* ─────────────────────────────────────────────
   6. VERIFY RESET TOKEN
   GET /api/auth/verify-reset-token/:token
───────────────────────────────────────────── */
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken:  req.params.token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired.',
      });
    }

    res.json({ success: true, message: 'Token is valid.', email: user.email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   7. RESET PASSWORD
   POST /api/auth/reset-password/:token
───────────────────────────────────────────── */
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const user = await User.findOne({
      resetPasswordToken:  token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.',
      });
    }

    user.password            = password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Error resetting password.' });
  }
});

/* ─────────────────────────────────────────────
   8. INVITE DOCTOR — admin sends setup email
   POST /api/auth/invite-doctor
───────────────────────────────────────────── */
router.post('/invite-doctor', verifyToken, isAdmin, async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'doctorId is required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const user = await User.findById(doctor.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Doctor user account not found. Please add the doctor first.',
      });
    }

    const setupToken  = crypto.randomBytes(32).toString('hex');
    const setupExpiry = Date.now() + 48 * 60 * 60 * 1000;

    user.resetPasswordToken  = setupToken;
    user.resetPasswordExpiry = setupExpiry;
    await user.save();

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const setupUrl     = `${FRONTEND_URL}/doctor-setup/${setupToken}`;

    const sent = await sendEmail({
      to:      user.email,
      subject: 'Welcome to SJCH Portal — Activate Your Doctor Account',
      html:    doctorWelcomeEmail(doctor.name, user.email, setupUrl),
    });

    if (!sent) {
      return res.status(200).json({
        success:  false,
        message:  'Email failed to send. Share this link manually with the doctor:',
        setupUrl,
      });
    }

    res.json({
      success:  true,
      message:  `Setup link sent to ${user.email}`,
      setupUrl,
    });
  } catch (err) {
    console.error('Invite doctor error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   8b. ADMIN SET DOCTOR PASSWORD DIRECTLY
   POST /api/auth/admin-set-password
───────────────────────────────────────────── */
router.post('/admin-set-password', verifyToken, isAdmin, async (req, res) => {
  try {
    const { doctorId, password } = req.body;

    if (!doctorId || !password) {
      return res.status(400).json({
        success: false,
        message: 'doctorId and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const user = await User.findById(doctor.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Linked user account not found',
      });
    }

    user.password            = password;
    user.isProfileComplete   = true;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    await Doctor.findByIdAndUpdate(doctorId, { isApproved: 'approved' });

    res.json({
      success: true,
      message: `Password set successfully for Dr. ${doctor.name}. Account is now active.`,
    });
  } catch (err) {
    console.error('Admin set password error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   9. VERIFY SETUP TOKEN
   GET /api/auth/verify-setup-token/:token
───────────────────────────────────────────── */
router.get('/verify-setup-token/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken:  req.params.token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Setup link is invalid or expired.',
      });
    }

    const doctor = await Doctor.findOne({ userId: user._id });

    res.json({
      success:  true,
      email:    user.email,
      name:     doctor?.name || user.name,
      isDoctor: !!doctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────
   10. DOCTOR SETUP — set password via token
   POST /api/auth/doctor-setup/:token
───────────────────────────────────────────── */
router.post('/doctor-setup/:token', async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const user = await User.findOne({
      resetPasswordToken:  token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Setup link is invalid or has expired. Ask admin to resend.',
      });
    }

    user.password            = password;
    user.isProfileComplete   = true;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    await Doctor.findOneAndUpdate(
      { userId: user._id },
      { isApproved: 'approved' }
    );

    res.status(200).json({
      success: true,
      message: 'Account activated! You can now log in with your email and new password.',
    });
  } catch (err) {
    console.error('Doctor setup error:', err);
    res.status(500).json({ success: false, message: 'Error setting up account.' });
  }
});

/* ─────────────────────────────────────────────
   11. GET USERS
───────────────────────────────────────────── */
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({
      role:              'doctor',
      isProfileComplete: false,
    }).select('name email _id');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

/* ─────────────────────────────────────────────
   12. AVAILABLE FOR PROMOTION
───────────────────────────────────────────── */
router.get('/available-for-promotion', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({
      role:              { $in: ['user', 'patient'] },
      isProfileComplete: { $ne: true },
    }).select('name email role _id');

    res.status(200).json({
      success: true,
      count:   users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;