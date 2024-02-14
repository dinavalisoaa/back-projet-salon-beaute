const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/notifications/user/:userId', notificationController.getCustomerNotifications);
router.post('/notification', notificationController.sendNotification);
router.put('/notification/:notificationId/user/:userId/markAsSeen', notificationController.markAsSeen);
router.put('/notification/:notificationId/user/:userId/markAsRead', notificationController.markAsRead);
router.put('/notifications/user/:userId/markAllAsRead', notificationController.markAllAsRead);

module.exports = router;