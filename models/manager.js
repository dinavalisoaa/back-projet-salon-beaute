const mongoose = require('mongoose');

const managerData = new mongoose.Schema({
    name: String,
    firstname: String,
    email: String,
    password: String
});

const Manager = mongoose.model('Manager', managerData);

module.exports = Manager;