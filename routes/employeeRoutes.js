const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/employees', employeeController.getAllEmployee);
router.get('/employees/active', employeeController.getActiveEmployee);
router.post('/employee', employeeController.registration);
router.put('/employee/:id', employeeController.updateEmployee);
router.put('/employee/:id/activate', employeeController.activateAccount);
router.put('/employee/:id/deactivate', employeeController.deactivateAccount);
router.put('/employee/connection', employeeController.authentication);

module.exports = router;