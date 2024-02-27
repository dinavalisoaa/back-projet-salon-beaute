const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/appointments', appointmentController.getAllAppointment);
router.post('/appointment', appointmentController.createAppointment);
router.get('/appointment/pref', appointmentController.getPref);
router.get('/appointment/:id', appointmentController.getAppointment);
router.get('/appointment/customer/:customerId', appointmentController.getCustomerAppointment);
router.put('/appointment/:id', appointmentController.updateAppointment);
router.get('/appointment/state/:emp', appointmentController.getByEmp);
router.patch('/appointment/:id', appointmentController.patchAppointment);
router.delete('/appointment/:id', appointmentController.deleteAppointment);
router.delete('/appointment/:id/pay', appointmentController.payAppointment);
module.exports = router;