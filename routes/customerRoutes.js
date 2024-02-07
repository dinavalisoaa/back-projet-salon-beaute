const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/customers', customerController.getAllCustomer);
router.get('/customer/:customerId/services', customerController.getServiceWithPreference);
router.get('/customer/:customerId/employees', customerController.getEmployeeWithPreference);
router.post('/customer', customerController.createCustomer);
router.post('/customer/connection', customerController.authentication);
router.post('/customer/registration', customerController.registration);
router.post('/current-user', customerController.getUserConnected);
router.put('/customer/:id/choose/service', customerController.choosePreferredService);
router.put('/customer/:id/choose/employee', customerController.choosePreferredEmployee);

module.exports = router;