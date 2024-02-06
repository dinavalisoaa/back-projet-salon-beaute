const Utils = require('../utils')
const Sex = require('../models/sex');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Get all sexes
exports.getAllSexes = async (req, res) => {
    try {
        const sex = await Sex.find().exec();
        res.json(sex);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
