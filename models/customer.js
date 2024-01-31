const mongoose = require('mongoose');

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
    password: String
});

const Customer = mongoose.model('Customer', customerData);

module.exports = Customer;