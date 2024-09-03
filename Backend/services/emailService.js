const { transporter, mailOptions } = require('../eMailSetup/mailsetUp');

const sendEmail = async (email, emailSubject, mailData, attachedFileDetails = []) => {
    const mailOptionsInfo = {
        from: mailOptions.from, 
        to: email,
        subject: emailSubject,
        html: mailData,
        attachments: attachedFileDetails
    };

    try {
        const isSuccess = await transporter.sendMail(mailOptionsInfo);
        return isSuccess;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = {
    sendEmail
};
