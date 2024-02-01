const mongoose = require('mongoose');

const serviceData = new mongoose.Schema({
    name: String,
    price: Number,
    duration: Number,
    commission: Number,
    illustration: String 
});

const Service = mongoose.model('Service', serviceData);

module.exports = Service;