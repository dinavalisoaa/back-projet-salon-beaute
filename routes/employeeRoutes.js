const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/employees', employeeController.getAllEmployee);
router.get('/employee/:id', employeeController.getEmployee);
router.get('/employees/active', employeeController.getActiveEmployee);
router.get('/employee/:employeeId/commission', employeeController.commissionForTheDay);
router.post('/employee', employeeController.registration);
router.put('/employee/:id', employeeController.updateEmployee);
router.put('/employee/:id/activate', employeeController.activateAccount);
router.put('/employee/:id/deactivate', employeeController.deactivateAccount);
router.post('/employee/connection', employeeController.authentication);

module.exports = router;