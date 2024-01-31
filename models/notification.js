const mongoose = require('mongoose');

const notificationData = new mongoose.Schema({
    date: Date,
    content: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderModel', 
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Customer', 'Employee'] 
    },
    recipient: [{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }]
});

const Notification = mongoose.model('Notification', notificationData);

module.exports = Notification;

