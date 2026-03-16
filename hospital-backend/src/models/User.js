const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:    { type: String, default: '' },
  phone:    { type: String, default: '0000000000' },
  address:  { type: String, default: '' },
  gender:   { type: String, default: 'Not Selected' },
  dob:      { type: String, default: 'Not Selected' },

  // ✅ FIXED: added 'user' to enum so registration works
  role: {
    type:    String,
    enum:    ['user', 'patient', 'doctor', 'admin'],
    default: 'user',
  },

  isProfileComplete: { type: Boolean, default: true },

  // Password reset fields
  resetPasswordToken:  { type: String },
  resetPasswordExpiry: { type: Date   },

}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt    = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);