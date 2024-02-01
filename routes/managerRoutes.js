const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

router.get('/managers', managerController.getAllManager);
router.post('/manager', managerController.createManager);
router.post('/manager/connection', managerController.authentication);
// router.get('/songs/:id', songController.getSong);
// router.put('/songs/:id', songController.updateSong);
// router.delete('/songs/:id', songController.deleteSong);

module.exports = router;