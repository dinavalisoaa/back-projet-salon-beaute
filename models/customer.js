const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preference = new Schema({
    service: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    employee: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }]
});

const customerData = new mongoose.Schema({
    name: String,
    firstname: String,
    dateOfBirth: Date,
    sex: {
        type: Schema.Types.ObjectId,
        ref: 'Sex'
    },
    address: String,
    phoneNumber: String,
    email: String,
    profile: String,
    password: String,
    preference: {
        type: preference
    }
});

const Customer = mongoose.model('Customer', customerData);

module.exports = Customer;