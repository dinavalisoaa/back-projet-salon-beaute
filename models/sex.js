const mongoose = require('mongoose');

const sexData = new mongoose.Schema({
    type: String
});

const Sex = mongoose.model('Sex', sexData);

module.exports = Sex;