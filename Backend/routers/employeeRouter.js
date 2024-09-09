const express = require('express')
const router = express.Router();
const employeeController = require('../controllers/employeeController')
const Validator = require('../validator/employeeValidator')
const authMiddleare= require('../middleware/authMiddleware')

router.post("/employees",
    Validator.createEmployee,
    employeeController.createEmployee
)

// list employee
router.get('/employees', authMiddleare.verifyUserToken, employeeController.listEmployee);

// activate employee
router.post('/activate/:employeeId', authMiddleare.verifyUserToken, employeeController.activateEmployee);

// dectivate employee
router.post('/deactivate/:employeeId', authMiddleare.verifyUserToken, employeeController.deactivateEmployee);



module.exports = router;