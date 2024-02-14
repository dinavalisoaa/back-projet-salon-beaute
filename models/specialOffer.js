const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialOfferData = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
    },
    launchDate: Date,
    message: String,
    expirationDate: Date
});

const SpecialOffer = mongoose.model('SpecialOffer', specialOfferData);

module.exports = SpecialOffer;