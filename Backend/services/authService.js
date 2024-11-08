const Employee = require('../models/employeeModel');
const OTP = require('../models/otpModel');
const emailService = require('./emailService');
const authMiddleare= require("../middleware/authMiddleware")

const OTP_EXPIRY_TIME = 5 * 60 * 1000;

const verifyEmail = async (email) => {
    return await Employee.findOne({ email });
};


const requestOTP = async (email) => {
    try {
        const employee = await verifyEmail(email);
        if (!employee) {
            return { success: false, employeeNotFound: true };
        }

        let otpRecord = await OTP.findOne({ email });
        if (otpRecord && otpRecord.attempts >= 3) {
            return { success: false, maximumAttempted: true };
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

        return { success: true, otpSent: true, attempts: otpRecord.attempts };
    } catch (error) {
        console.error('Error requesting OTP:', error);
        return { success: false, error: 'Server error, please try again later.' };
    }
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
    try {
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return { success: false, otpNotFound: true };
        }

        const now = Date.now();
        if (now - otpRecord.createdAt > OTP_EXPIRY_TIME) {
            return { success: false, otpExpired: true };
        }

        if (otpRecord.otp !== otp) {
            return { success: false, invalidOtp: true };
        }

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return { success: false, employeeNotFound: true };
        }

        employee.isAuthenticated = true;
        await employee.save();

        const token = await  authMiddleare.generateUserToken({employeeId:employee.employeeId})

        await OTP.deleteOne({ email });

        return { success: true, token,employee };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, error: 'Server error, please try again later.' };
    }
};

module.exports = {
    verifyOTP,
    requestOTP
};













