const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/service', songController.getAllSong);
router.post('/service', songController.createSong);
router.get('/service/:id', songController.getSong);
router.put('/service/:id', songController.updateSong);
router.delete('/service/:id', songController.deleteSong);

module.exports = router;