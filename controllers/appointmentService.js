const Appointment = require("../models/appointment");
// const Utils = require("../utils");
const Customer = require("../models/customer");
const Service = require("../models/service");
const Utils = require("../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
 
async function test() {
  const appointment_data = req.body;
  try {
    
    const appointments = await Appointment.find({
        $and: [
            { $eq: [{ $year: "$date" }, 2024] },
            { $eq: [{ $month: "$date" }, 2] },
            { $eq: [{ $dayOfMonth: "$date" }, 22] },
          ],
    })

    .populate("service")

    .exec();
    const appointment = new Appointment(appointments);
    setTotalDurationAndAmount(appointment);
    return appointment;
    // // appointment.employee = null;
    
    // // const savedAppointment = await appointment.save();
    // res.status(201).json(savedAppointment);
  } catch (error) {
    // res.status(500).json({ error: error });
  }
};