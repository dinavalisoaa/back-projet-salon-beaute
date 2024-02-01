const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/employees', employeeController.getAllEmployee);
router.get('/employees/active', employeeController.getActiveEmployee);
router.post('/employee', employeeController.registration);
// router.get('/songs/:id', songController.getSong);
// router.put('/songs/:id', songController.updateSong);
// router.delete('/songs/:id', songController.deleteSong);

module.exports = router;