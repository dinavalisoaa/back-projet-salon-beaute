const Manager = require('../models/manager');
const Utils = require('../utils')

// Create a new manager
exports.createManager = async (req, res) => {
    const manager = req.body;
    try {
        const newManager = new Manager(manager);
        newManager.password = Utils.encryptPassword(manager.password);
        const savedManager = await newManager.save();
        res.status(201).json(savedManager);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all managers
exports.getAllManager = async (req, res) => {
    try {
        const manager = await Manager.find().exec();
        res.json(manager);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Authentication
exports.authentication = async (req, res) => {
    try {
        const { email, password } = req.body;
        const manager = await Manager.findOne({
            email: email,
            password: Utils.encryptPassword(password)
        })
        if(manager != null){
            res.json(manager);
        }
        else{
            throw new Error("Compte introuvable");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



