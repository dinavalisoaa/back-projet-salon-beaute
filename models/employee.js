const mongoose = require('mongoose');

const scheduleForm = new Schema({
    entry: Date,
    exit: Date
});

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
        type: scheduleForm
    },
    status: Number
});

const Employee = mongoose.model('Employee', employeeData);

module.exports = Employee;