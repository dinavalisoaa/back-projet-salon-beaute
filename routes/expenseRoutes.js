const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/expense', expenseController.getAllExpense);
router.post('/expense', expenseController.createExpense);
router.get('/expense/:id', expenseController.getExpense);
router.put('/expense/:id', expenseController.updateExpense);
router.delete('/expense/:id', expenseController.deleteExpense);
module.exports = router;