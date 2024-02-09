const Appointment = require("../models/appointment");
const Utils = require('../utils')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.createAppointment = async (req, res) => {
  const appointment_data = req.body;
  try {
    const appointment = new Appointment(appointment_data);
    appointment.status = 1;
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: error });
  }
};

// Get all appointments
exports.getAllAppointment = async (req, res) => {
  try {
    var json_filter = {};
    const appointment = await Appointment.find(json_filter).populate('customer').populate('service').exec();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching appointment" });
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
      {isPaid:true },
      { new: true }
    );
   
    const appointment=new Appointment();
    appointment.date=date;
    appointment.debit=debit;
    appointment.credit=credit;
    appointment.description=description;


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
  const {  date, customer, service, status, isPaid } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
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
      .json({ error: "An error occurred while updating the appointment" });
  }
};

// Delete a appointment by ID
exports.deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  console.log(appointmentId);
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
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

function setTotalDurationAndAmount(appointment){
  appointment.forEach(appointment => {
    let totalDuration = 0;
    let totalAmount = 0;
    appointment.service.forEach(service => {
      totalDuration += service.duration;
      totalAmount += service.price;
    });
    appointment.totalDuration = Utils.convertMinutesToHoursAndMinutes(totalDuration);
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
                  customer: new ObjectId(customerId)
              }
          },
          {
            $project: {
              _id: 1,
              date: 1,
              customer: 1, 
              service: 1,
              status: 1,
              totalDuration: 2,   
              totalAmount: 2     
            },
          }
      ]);
      await Appointment.populate(appointment, [{ path: 'service' }]);
      setTotalDurationAndAmount(appointment);
      res.json(appointment);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};