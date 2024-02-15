const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard/employee/working-time/average', dashboardController.employeeAverageWorkingTime);
router.get('/dashboard/reservations/number/per/day', dashboardController.numberOfReservationsPerDay);
router.get('/dashboard/reservations/average/per/day', dashboardController.averageNumberOfReservationsPerDay);
router.get('/dashboard/reservations/:year/number/per/month', dashboardController.numberOfReservationsPerMonth);
router.get('/dashboard/sales/per/day', dashboardController.salesPerDay);
router.get('/dashboard/sales/average/per/day', dashboardController.averageSalesPerDay);
router.get('/dashboard/sales/:year/per/month', dashboardController.salesPerMonth);

module.exports = router;