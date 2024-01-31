const mongoose = require('mongoose');

const appointmentData = new mongoose.Schema({
    date: Date,
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    service: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    status: Number,
    isPaid: Boolean
});

const Appointment = mongoose.model('Appointment', appointmentData);

module.exports = Appointment;