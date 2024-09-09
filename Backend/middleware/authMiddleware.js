const jwt = require("jsonwebtoken");
const Response = require('../helpers/response');
const message = require('../constants/constMessage');
const employeeService = require('../services/employeeService');

const generateUserToken = async (data) => {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Data must be a plain Object');
    }
    
    const tokenPayload = {
        ...data,
        isActiveUser: data.isActiveUser 
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_USER_SECRET, {
        expiresIn: '365d',
    });
    return `Bearer ${token}`;
};

const verifyUserToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return Response.failResponse(req, res, null, message.missingAuthHeader, 401);
        }

        let token = req.headers.authorization;

        if (token.startsWith("Bearer ")) {
            token = token.substring(7, token.length);
        } else {
            return Response.failResponse(req, res, null, message.invalidTokenFormat, 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        const employeeId = decoded.employeeId;

        
        const isActiveUserFromDb = await employeeService.verifyEmployee(employeeId);

        if (isActiveUserFromDb) {
            
            req.employeeId = employeeId;
            req.isActiveUser = isActiveUserFromDb; 
            next();
        } else {
            return Response.failResponse(
                req,
                res,
                { isInValidUser: true },
                message.invalidUser,
                401
            );
        }
    } catch (error) {
        return Response.failResponse(req, res, null, message.invalidToken, 401);
    }
};

module.exports = {
    generateUserToken,
    verifyUserToken
};
