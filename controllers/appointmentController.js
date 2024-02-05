const Appointment = require("../models/appointment");
const Utils = require('../utils')
const Customer = require('../models/customer');
const Service = require('../models/service');
const ObjectId = mongoose.Types.ObjectId;

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const {  date,
    customer,
    service,
    status,
    isPaid } = req.body;
  try {
    const appointment = new Appointment({
      date,
      customer,
      service,
      status,
      isPaid
    });
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
  const { date,
    description,
    customer,
    debit,
    credit } = req.body;
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

    /////////////////
    const savedAppointment = await appointment.save();

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
  const {  date,
    customer,
    service,
    status,
    isPaid } = req.body;
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

exports.totalDurationAndAmount = async (req, res) => {
  const appointmentId = req.params.id;
  try {
      let duration = 0;
      let amount = 0;
      const appointment = await Appointment.find({
          _id: new ObjectId(appointmentId)
      });
      appointment.service.forEach(element => {
          duration += element.duration;
          amount += element.amount;
      });
      res.json({ duration: duration, amount: amount });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

// Get customer appointment
exports.getCustomerAppointment = async (req, res) => {
  const customerId = req.params.id;
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
              totalDuration: 2,   //Default value
              totalAmount: 2      //Default value
            },
          }
      ]);
      await Appointment.populate(appointment, [{ path: 'service' }]);
      const totalDurationInMinutes = appointment.service.duration;
      for (const element of appointment) {
          // element.totalDuration = Utils.
      };
      res.json(appointment);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
