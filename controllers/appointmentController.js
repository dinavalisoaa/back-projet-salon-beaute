const Appointment = require("../models/appointment");
const Customer = require("../models/customer");

// Create a new expense
exports.createAppointment = async (req, res) => {
  const {  date,
    customer,
    service,
    status,
    isPaid } = req.body;
  try {
    const expense = new Appointment({
      date,
      customer,
      service,
      status,
      isPaid
    });
    const savedAppointment = await expense.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: error });
  }
};

// Get all expenses
exports.getAllAppointment = async (req, res) => {
  try {
    var json_filter = {};
    // if (req.query.description) {
    //   json_filter.description = {
    //     $regex: ".*" + req.query.description + ".*",
    //   };
    // }
    // if (req.query.date) {
    //   json_filter.date = req.query.date;
    // }
    // if (req.query.amount) {
    //   json_filter.amount = req.query.amount;
    // }

    const expense = await Appointment.find(json_filter).populate('customer').populate('service').exec();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching expense" });
  }
};

// Get a specific expense by ID
exports.getAppointment = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const expense = await Appointment.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the expense" });
  }
};

// Update a expense by ID
exports.updateAppointment = async (req, res) => {
  const expenseId = req.params.id;
  const {  date,
    customer,
    service,
    status,
    isPaid } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      expenseId,
      { date,
        customer,
        service,
        status,
        isPaid },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(updatedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the expense" });
  }
};

// Delete a expense by ID
exports.deleteAppointment = async (req, res) => {
  const expenseId = req.params.id;
  console.log(expenseId);
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(expenseId);
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(deletedAppointment);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the expense" });
  }
};
