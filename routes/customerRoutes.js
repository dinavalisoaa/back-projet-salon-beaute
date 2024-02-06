const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/customers', customerController.getAllCustomer);
router.post('/customer', customerController.createCustomer);
router.post('/customer/connection', customerController.authentication);
router.post('/customer/registration', customerController.registration);
router.post('/current-user', customerController.getUserConnected);
router.put('/customer/:id/choose/service', customerController.choosePreferredService);
router.put('/customer/:id/choose/employee', customerController.choosePreferredEmployee);
// router.get('/songs/:id', songController.getSong);
// router.put('/songs/:id', songController.updateSong);
// router.delete('/songs/:id', songController.deleteSong);

module.exports = router;