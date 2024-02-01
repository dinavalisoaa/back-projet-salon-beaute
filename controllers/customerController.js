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
        res.status(500).json({ error: error.message });
    }
};

// Get all customers
exports.getAllCustomer = async (req, res) => {
    try {
        const customer = await Customer.find().populate('sex').exec();
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
};

//Registration (signUp)
exports.registration = async (req, res) => {
    const customer = req.body;
    try {
        if(customer.name == null || customer.firstname == null || customer.dateOfBirth == null || customer.sex == null || customer.phoneNumber == null || customer.email == null || customer.password == null || customer.confirmationPassword == null){
            throw new Error("Veuillez remplir les champs obligatoires");
        }
        if(customer.password != customer.confirmationPassword){
            throw new Error("Mot de passe de confirmation invalide");
        }
        if(!Utils.isValidEmail(customer.email)){
            throw new Error("Adresse email invalide");
        }
        const newCustomer = new Customer(customer);
        newCustomer.password = Utils.encryptPassword(customer.password);
        newCustomer.profile = null;
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



