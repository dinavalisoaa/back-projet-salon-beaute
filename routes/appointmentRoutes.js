const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/appointment', appointmentController.getAllAppointment);
router.post('/appointment', appointmentController.createAppointment);
router.get('/appointment/:id', appointmentController.getAppointment);
router.get('/appointment/customer/:customerId', appointmentController.getCustomerAppointment);
router.put('/appointment/:id', appointmentController.updateAppointment);
router.delete('/appointment/:id', appointmentController.deleteAppointment);
router.delete('/appointment/:id/pay', appointmentController.payAppointment);
module.exports = router;