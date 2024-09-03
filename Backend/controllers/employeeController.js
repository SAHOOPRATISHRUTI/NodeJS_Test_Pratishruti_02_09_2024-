const employeeService = require('../services/employeeService');
const Response = require('../helpers/response');
const messages = require('../constants/constMessage');

const createEmployee = async (req, res) => {
    try {
        const result = await employeeService.craeateEmployee(req.body);
        console.log(result);
        if (result?.isDuplicateEmail) {
            return Response.failResponse(req, res, null, messages.duplicateEmail, 200);
        }
        return Response.successResponse(req, res, result, messages.createdSucess, 201);
    } catch (error) {
        console.log(error);
        return Response.errorResponse(req, res, error);
    }
};

const listEmployee = async(req, res) => {
    try{
        const result = await employeeService.listEmployee(req.body, req.query);
        if (result.totalCount === 0){
            return Response.failResponse(req, res, null, messages.recordsNotFound, 200);
        }
        return Response.successResponse(req, res, result, messages.recordsFound, 200);
    } catch(error){
        console.log(error);
        return Response.errorResponse(req, res, error);
    }
}

module.exports = {
    createEmployee,
    listEmployee
};
