const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Hospital Portal" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message, // Using HTML for a nice design
    };

    await transporter.sendEmail(mailOptions);
};

module.exports = sendEmail;