const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/email/send', emailController.sendEmail);
router.post('/email/scheduled/send', emailController.sendScheduledEmail);

module.exports = router;