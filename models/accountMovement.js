const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountMovementData = new mongoose.Schema({
    date: Date,
    description: String,
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    debit: Number,
    credit: Number
});

const AccountMovement = mongoose.model('AccountMovement', accountMovementData);

module.exports = AccountMovement;