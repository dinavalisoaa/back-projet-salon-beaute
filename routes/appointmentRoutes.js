const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/appointment', appointmentController.getAllAppointment);
router.post('/appointment', appointmentController.createAppointment);
router.get('/appointment/:id', appointmentController.getAppointment);
router.put('/appointment/:id', appointmentController.updateAppointment);
router.delete('/appointment/:id', appointmentController.deleteAppointment);
module.exports = router;