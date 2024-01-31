const mongoose = require('mongoose');

const expenseData = new mongoose.Schema({
    date: Date,
    description: String,
    amount: Number
});

const Expense = mongoose.model('Expense', expenseData);

module.exports = Expense;