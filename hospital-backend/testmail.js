require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function test() {
  console.log('Testing with:', process.env.GMAIL_USER);
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to:   process.env.GMAIL_USER, // send to yourself
      subject: 'SJCH Test Email',
      text: 'If you see this, Gmail SMTP is working!',
    });
    console.log('✅ Email sent successfully!');
  } catch (err) {
    console.log('❌ Email failed:', err.message);
  }
}

test();