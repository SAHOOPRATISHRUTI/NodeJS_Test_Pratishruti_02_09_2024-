const Employee = require('../models/employeeModel');
const OTP = require('../models/otpModel');
const emailService = require('./emailService');

const OTP_EXPIRY_TIME = 5 * 60 * 1000;

const verifyEmail = async (email) => {
    return await Employee.findOne({ email });
};

const requestOTP = async (email) => {
    const employee = await verifyEmail(email);
    if (!employee) {
        return { employeeNotFound: true };
    }

    let otpRecord = await OTP.findOne({ email });
    if (otpRecord && otpRecord.attempts >= 3) {
        return { maximumAttempted: true };
    }

    const now = Date.now();
    const otp = generateOTP();

    if (otpRecord) {
        otpRecord.otp = otp;
        otpRecord.attempts += 1;
        otpRecord.createdAt = now;
        await otpRecord.save();
    } else {
        otpRecord = new OTP({ email, otp, attempts: 1, createdAt: now });
        await otpRecord.save();
    }

    const emailSubject = 'Your OTP for Verification';
    const mailData = `Your OTP for verification is <strong>${otp}</strong>`;

    await emailService.sendEmail(email, emailSubject, mailData);
    return { otp, attempts: otpRecord.attempts, otpSent: true };
};

const generateOTP = () => {
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

const verifyOTP = async (email, otp) => {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
        return { otpNotFound: true };
    }
    const now = Date.now();
    if (now - otpRecord.createdAt > OTP_EXPIRY_TIME) {
        return { otpExpired: true };
    }
    if (otpRecord.otp !== otp) {
        return { invalidOtp: true };
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
        return { employeeNotFound: true };
    }

    employee.isAuthenticated = true;
    await employee.save();

    await OTP.deleteOne({ email });
    return { success: true, employee };
};

module.exports = {
    verifyOTP,
    requestOTP
};

















