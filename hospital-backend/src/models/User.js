const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" }, 
    phone: { type: String, default: "0000000000" },
    address: { type: String, default: "" },
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

// --- 1. FIXED Password Hashing ---
// Removed 'next' parameter to let the async function return a promise naturally
userSchema.pre('save', async function () {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error); // This will be caught by your route's catch block
    }
});

// --- 2. Password Comparison Method ---
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);