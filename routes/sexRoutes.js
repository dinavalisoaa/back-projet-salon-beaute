const express = require('express');
const router = express.Router();
const sexController = require('../controllers/sexController');

router.get('/sexes', sexController.getAllSexes);

module.exports = router;