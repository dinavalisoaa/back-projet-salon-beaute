const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeData = new mongoose.Schema({
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
    schedule: {
        entry: Date,
        exit: Date
    },
    status: Number
});

const Employee = mongoose.model('Employee', employeeData);

module.exports = Employee;