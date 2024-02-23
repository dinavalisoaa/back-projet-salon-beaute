"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var employeeData = new mongoose.Schema({
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
  speciality: String,
  schedule: {
    entry: Date,
    exit: Date
  },
  status: Number
});
var Employee = mongoose.model('Employee', employeeData);
module.exports = Employee;