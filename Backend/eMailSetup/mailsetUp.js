const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.USER}`,
        pass: `${process.env.PASS}`,
    }
});

const mailOptions = {
    from: `${process.env.USER}`,
    to: '', 
    subject: 'Your OTP for Verification',
    html: '<b>Welcome to NTSPL</b>',
    attachments: []
};

module.exports = { transporter, mailOptions };
