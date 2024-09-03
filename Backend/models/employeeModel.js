const mongoose = require('mongoose')
const validator = require('validator')

const EmployeeSchema = new mongoose.Schema({
    employeeName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    employeeId:{
        type:String,
        required:true,
      
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true,
        validator:validator.isEmail,
        message:`{VALUE} is not a valid Email .Please Enter a Valid Email`,
        
        sparse: true 
    },
    designation:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
  
    },
    unit:{
        type:String,
        required:true,
  
    }
},{timestamps:true})
const Employee = mongoose.model('Employee',EmployeeSchema)

module.exports=Employee;