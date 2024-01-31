const Customer = require('../models/customer');
const Utils = require('../utils')
const Sex = require('../models/sex');

// Create a new customer
exports.createCustomer = async (req, res) => {
    const customer = req.body;
    try {
        const newCustomer = new Customer(customer);
        newCustomer.password = Utils.encryptPassword(customer.password);
        newCustomer.profile = null;
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the song' });
    }
};

// Get all customers
exports.getAllCustomer = async (req, res) => {
    try {
        const customer = await Customer.find().populate('sex').exec();
        res.json(customer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching customer' });
    }
};

//Authentication
exports.authentication = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({
            email: email,
            password: Utils.encryptPassword(password)
        })
        .populate('sex');
        if(customer != null){
            res.json(customer);
        }
        else{
            throw new Error("Compte introuvable");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching customer' });
    }
};



