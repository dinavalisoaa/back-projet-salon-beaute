const Appointment = require('../models/appointment');
const Utils = require('../utils')
const Customer = require('../models/customer');
const Service = require('../models/service');
const ObjectId = mongoose.Types.ObjectId;

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



exports.appointmentHistory = async (req, res) => {
    
};



