const Appointment = require("../models/appointment");
// const Utils = require("../utils");
const Customer = require("../models/customer");
const Service = require("../models/service");
const Utils = require("../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
mongoose.m;
exports.createAppointment = async (req, res) => {
  const appointment_data = req.body;
  try {
    const appointment = new Appointment(appointment_data);
    appointment.employee = null;
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get all appointments
exports.getAllAppointment = async (req, res) => {
  var json_filter = req.body;
  var json_entry = {};
  let customer = json_filter?.customer;
  let emp = json_filter?.employee;
  let status = json_filter?.status;
  let service = json_filter?.service;
  let serviceId = [];
  let querys = req.query.year;
  if (querys) {
    json_entry.$expr = {
      $and: [
        { $eq: [{ $year: "$date" }, req.query.year] },
        { $eq: [{ $month: "$date" }, req.query.month] },
        { $eq: [{ $dayOfMonth: "$date" }, req.query.day] },
      ],
    };
    // querys=
  }
  if (
    json_filter.service != undefined &&
    json_filter.service != "" &&
    json_filter.service.length != 0
  ) {
    service.forEach((element) => {
      serviceId.push(new ObjectId(element._id));
    });
    json_entry.service = {
      $in: serviceId,
    };
  }

  if (customer != undefined) {
    json_entry.customer = new ObjectId(customer._id);
  }
  if (json_filter.date != undefined && json_filter.date != "") {
    // json_entry.date =mongoose.Types.Date (json_filter.date);
  }
  if (status != undefined) {
    json_entry.status = status;
  }
  if (emp != undefined) {
    console.log(emp._id);

    json_entry.employee = new ObjectId(emp._id);
  }
  console.log(json_entry);
  var sort_json = {}; //req.body;
  // if (date) {
  //   sort_json.date = date;
  // }
  try {
    var json_filter = {};
    const appointment = await Appointment.find(json_entry)
      .populate("customer")
      .populate("service")
      .populate("employee")
      .sort(sort_json)
      .exec();

    res.json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching appointment" });
  }
};

// Get a specific appointment by ID
exports.getAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the appointment" });
  }
};

exports.payAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const { date, description, debit, credit } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { isPaid: true },
      { new: true }
    );

    const appointment = new Appointment();
    appointment.date = date;
    appointment.debit = debit;
    appointment.credit = credit;
    appointment.description = description;

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(updatedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the appointment" });
  }
};

// Update a appointment by ID
exports.updateAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const { date, customer, service, status, isPaid } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date, customer, service, status, isPaid },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(updatedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the appointment" });
  }
};

exports.patchAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const { status, employee } = req.body;
  // console.log(appointmentId);
  let employees = null;
  if (employee != null && employee != undefined) {
    employees = new ObjectId(employee?._id);
  }
  console.log(employees + "<<<<");

  try {
    const current = await Appointment.findById(appointmentId).exec();
    if (current.employee != null && employee != null) {
      if (current.employee._id != employee._id) {
        console.log("console.log()" + current.employee + " VS " + employee._id);
        return res
          .status(403)
          .json({ error: "La tache ne vous appartienne pas" });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status, employee: employees },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the appointment" + error,
    });
  }
};
// Delete a appointment by ID
exports.deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  console.log(appointmentId);
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    );
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(deletedAppointment);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the appointment" });
  }
};

function setTotalDurationAndAmount(appointment) {
  appointment.forEach((appointment) => {
    let totalDuration = 0;
    let totalAmount = 0;
    appointment.service.forEach((service) => {
      totalDuration += service.duration;
      totalAmount += service.price;
    });
    appointment.totalDuration =
      Utils.convertMinutesToHoursAndMinutes(totalDuration);
    appointment.totalAmount = totalAmount;
  });
}

// Get customer appointment
exports.getCustomerAppointment = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const appointment = await Appointment.aggregate([
      {
        $match: {
          customer: new ObjectId(customerId),
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          customer: 1,
          service: 1,
          status: 1,
          totalDuration: 2,
          totalAmount: 2,
        },
      },
    ]);
    await Appointment.populate(appointment, [{ path: "service" }]);
    setTotalDurationAndAmount(appointment);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
