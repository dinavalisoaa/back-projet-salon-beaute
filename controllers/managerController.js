const Manager = require("../models/manager");
const Utils = require("../utils");

const jwt = require('jsonwebtoken');
// Create a new manager
exports.createManager = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const expense = new Manager({});
    expense.name = name;
    expense.email = email;
    expense.password = Utils.encryptPassword(password);
    console.log(expense);

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all managers
exports.getAllManager = async (req, res) => {
  try {
    const manager = await Manager.find().exec();
    res.json(manager);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Authentication
exports.authentication = async (req, res) => {
  try {
    const { email, password } = req.body;
    const manager = await Manager.findOne({
      email: email,
      password: Utils.encryptPassword(password),
    });
    if (manager != null) {
      const token = jwt.sign({ userId: manager._id }, "your-secret-key", {
        expiresIn: "15h",
      });
      res.setHeader("Authorization", token);
      console.log(token);
      res.status(200).json({ token, userId: manager._id });
    } else {
      throw new Error("Compte introuvable");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
