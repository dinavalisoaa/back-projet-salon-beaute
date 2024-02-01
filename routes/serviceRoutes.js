const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/service', serviceController.getAllService);
router.post('/service', serviceController.createService);
router.get('/service/:id', serviceController.getService);
router.put('/service/:id', serviceController.updateService);
router.delete('/servsice/:id', serviceController.deleteService);

module.exports = router;