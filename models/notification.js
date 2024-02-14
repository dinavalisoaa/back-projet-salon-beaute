const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationData = new mongoose.Schema({
    date: Date,
    content: String,
    sender: {
        type: Schema.Types.ObjectId
    },
    recipient: [{
        id: {
            type: Schema.Types.ObjectId
        },
        status: Number  //0: non lu, 1: lu, 2: vu
    }]
});

const Notification = mongoose.model('Notification', notificationData);

module.exports = Notification;

