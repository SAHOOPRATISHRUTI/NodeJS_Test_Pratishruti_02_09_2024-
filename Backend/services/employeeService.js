const Employee = require('../models/employeeModel');
const ObjectId = require('mongoose').Types.ObjectId;

const createEmployee = async (data) => {
    try {
        if (!data.email) {
            throw new Error('Email is required');
        }

        const emailDetails = await checkDuplicateEmail(data.email);
        
        if (emailDetails) {
            return { isDuplicateEmail: true };
        }

        const inputData = {
            employeeName: data.employeeName,
            employeeId: data.employeeId,
            email: data.email,
            designation: data.designation,
            department: data.department,
            unit: data.unit,
        };

        const empData = new Employee(inputData);
        const result = await empData.save();
        return result;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error('Error creating employee');
    }
}

const checkDuplicateEmail = async (email) => {
    try {
        const employee = await Employee.findOne(
            { email, isActive: true },
            { _id: 1, email: 1, employeeName: 1, isActive: 1 }
        );
        return employee;
    } catch (error) {
        console.error('Error checking duplicate email:', error);
        throw new Error('Error checking duplicate email');
    }
}
const listEmployee = async (queryData) => {
    try {
        const { order = 1, searchKey, employeeId, designation } = queryData;

        let query = {};
        if (searchKey) {
            query.$or = [
                { employeeName: { $regex: searchKey, $options: 'i' } },
                { employeeId: { $regex: searchKey, $options: 'i' } } 
            ];
        }

        if (employeeId) {
            query.employeeId = employeeId;
        }

        if (designation) {
            query.designation = designation;
        }

        const limit = queryData.limit ? parseInt(queryData.limit) : 10;
        const page = queryData.page ? parseInt(queryData.page) : 1;
        const skip = (page - 1) * limit;

        const totalCount = await Employee.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        const employeeData = await Employee.find(query)
            .sort({ _id: parseInt(order) })
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            currentPage: page,
            totalPages: totalPages,
            totalEmployees: totalCount,
            employeeData: employeeData,
        };
    } catch (error) {
        console.error('Error listing employees:', error);
        throw new Error('Error listing employees');
    }
};
;


const verifyEmployee = async (employeeId) => {
    try {
        return await Employee.findOne(
            { employeeId: employeeId },
            {
                _id: 1,
                email: 1,
                employeeName: 1,
                employeeId: 1,
                designation: 1,
                department: 1,
                unit: 1,
            }
        );
    } catch (error) {
        console.error('Error verifying employee:', error);
        throw new Error('Error verifying employee');
    }
}

const activateEmployee = async (employeeId) => {
    const result = await Employee.findOneAndUpdate(
        { employeeId },
        { $set: { isActive: true } },
        { new: true }
    );
    return result;
};

const deactivateEmployee = async (employeeId) => {
    const result = await Employee.findOneAndUpdate(
        { employeeId },
        { $set: { isActive: false } },
        { new: true } 
    );
    return result;
};


module.exports = {
    createEmployee,
    listEmployee,
    verifyEmployee,
    activateEmployee,
    deactivateEmployee
};
