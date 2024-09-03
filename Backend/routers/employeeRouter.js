const express = require('express')
const router = express.Router();
const employeeController = require('../controllers/employeeController')
const Validator = require('../validator/employeeValidator')


router.post("/employees",
    Validator.createEmployee,
    employeeController.createEmployee
)

router.get('/employees',
     employeeController.listEmployee
)



module.exports = router;