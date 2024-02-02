const Expense = require("../models/expense");

// Create a new expense
exports.createExpense = async (req, res) => {
  const { date, description, amount } = req.body;
  try {
    const expense = new Expense({
      date,
      description,
      amount,
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the expense" });
  }
};

// Get all expenses
exports.getAllExpense = async (req, res) => {
  try {
    var json_filter = {};
    if (req.query.description) {
      json_filter.description = {
        $regex: ".*" + req.query.description + ".*",
      };
    }
    if (req.query.date) {
      json_filter.date = req.query.date;
    }
    if (req.query.amount) {
      json_filter.amount = req.query.amount;
    }

    const expense = await Expense.find(json_filter);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching expense" });
  }
};

// Get a specific expense by ID
exports.getExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the expense" });
  }
};

// Update a expense by ID
exports.updateExpense = async (req, res) => {
  const expenseId = req.params.id;
  const { date, description, amount } = req.body;
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { date, description, amount },
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(updatedExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the expense" });
  }
};

// Delete a expense by ID
exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  console.log(expenseId);
  try {
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(deletedExpense);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the expense" });
  }
};
