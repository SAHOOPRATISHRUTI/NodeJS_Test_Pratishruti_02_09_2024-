const Employee = require('../models/employeeModel')
const ObjectId=require("mongoose").Types.ObjectId;


const craeateEmployee = async (data) => {
   
    if (!data.email) {
        return { isDuplicateEmail: true }; 
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
}


const checkDuplicateEmail = async(email)=>{
    const employee = await Employee.findOne(
        {email,isActive:true},
        {_id:1,email:1,name:1,isActive:1}
    );
    return employee;
}

const listEmployee = async(bodyData, queryData) => {
    const { order = 1 } = queryData;
    const { searchKey, employeeId, designation } = bodyData;

    let query = {};
    if (searchKey) {
        query.$or = [
            { employeeName: { $regex: searchKey, $options: 'i' } },
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
};


module.exports = {
    craeateEmployee,
    listEmployee
};