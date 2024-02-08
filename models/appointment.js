const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    status: Number, //achevé(2), inachevé(1), annulé(0)
    isPaid: Boolean
});

const Appointment = mongoose.model('Appointment', appointmentData);

module.exports = Appointment;