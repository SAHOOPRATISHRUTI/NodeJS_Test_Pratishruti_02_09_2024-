const authService = require('../services/authService');
const Responses = require('../helpers/response');
const messages = require('../constants/constMessage');

const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.requestOTP(email);
        if (result?.employeeNotFound) {
            return Responses.failResponse(req, res, null, messages.employeeNotFound, 400);
        }
        if (result?.maximumAttempted) {
            return Responses.failResponse(req, res, null, messages.maximumAttempted, 200);
        }
        return Responses.successResponse(req, res, result, messages.otpSentSuccess, 201);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOTP(email, otp);
        if (result?.otpNotFound) {
            return Responses.failResponse(req, res, null, messages.otpNotFound, 400);
        }
        if (result?.otpExpired) {
            return Responses.failResponse(req, res, null, messages.otpExpired, 200);
        }
        if (result?.invalidOtp) {
            return Responses.failResponse(req, res, null, messages.invalidOtp, 200);
        }
        return Responses.successResponse(req, res, result, messages.otpVerifiedSuccess, 201);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
};

module.exports = {
    requestOTP,
    verifyOTP
};
