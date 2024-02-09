const Customer = require('../models/customer');
const Service = require('../models/service');
const Utils = require('../utils')
const Sex = require('../models/sex');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Employee = require('../models/employee');
const ObjectId = mongoose.Types.ObjectId;
const utilController = require('./utilController');

// Create a new customer
exports.createCustomer = async (req, res) => {
        const { name,password,email } = req.body;
        try {   
          const expense = new Customer({
          });
          expense.name=name;
          expense.email=email;
          expense.password=Utils.encryptPassword(password);
          console.log(expense);

          const savedExpense = await expense.save();
          res.status(201).json(savedExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Token handler
exports.getUserConnected = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
    try {
      const decoded = jwt.verify(token, "your-secret-key");
      req.userId = decoded.userId;
      res.status(200).json({ userId:   decoded.userId });

      
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }

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
            const token = jwt.sign({ userId: customer._id }, 'your-secret-key', {
                expiresIn: '15h',
                });
                res.setHeader('Authorization',token);
                console.log({ token,userId: customer._id,role: "CUSTOMER", info:customer   });
                res.status(200).json({ token,userId: customer._id,role: "CUSTOMER", info:customer   });
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
        newCustomer.dateOfBirth = new Date( customer.dateOfBirth +'T00:00:00Z')
        newCustomer.password = Utils.encryptPassword(customer.password);
        newCustomer.profile = null;
        newCustomer.preference = { service: [], employee: [] };
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.choosePreferredService = async (req, res) => {
    const customerId = req.params.id;
    const { serviceId, isPreferred } = req.body;
    try {
        const customer = await Customer.findById(customerId);
        if(isPreferred){
            customer.preference.service.push(new ObjectId(serviceId));
        }
        else{
            const index = customer.preference.service.indexOf(serviceId);
            customer.preference.service.splice(index, 1);
        }
        customer.save();
        res.status(201).json({ message: 'Action successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while choosing service preference' });
    }
};

exports.choosePreferredEmployee = async (req, res) => {
    const customerId = req.params.id;
    const { employeeId, isPreferred } = req.body;
    try {
        const customer = await Customer.findById(customerId);
        console.log("customer: " + customer);
        if(isPreferred){
            customer.preference.employee.push(employeeId);
        }
        else{
            const index = customer.preference.employee.indexOf(employeeId);
            customer.preference.employee.splice(index, 1);
        }
        customer.save();
        res.status(201).json({ message: 'Action successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while choosing employee preference' });
    }
};


    async function isPreferredService(customerId, serviceId) {
        try {
            const preference = await Customer.find({
                _id: new ObjectId(customerId),
                'preference.service': { $in: [serviceId] }
            });
            if(preference.length > 0){
                return true;
            }
            return false;
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
  
    async function isPreferredEmployee(customerId, employeeId) {
        try {
            const preference = await Customer.find({
                _id: new ObjectId(customerId),
                'preference.employee': { $in: [employeeId] }
            });
            if(preference.length > 0){
                return true;
            }
            return false;
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

  exports.getServiceWithPreference = async (req, res) => {
    const customerId = req.params.customerId;
    try{
        const service = await Service.aggregate([
            {
              $project: {
                _id: 1,
                name: 1,
                price: 1, 
                duration: 1,
                commission: 1,
                illustration: 1,   
                isPreference: 2     
              },
            }
        ]);
        for (const element of service) {
            const serviceId = element._id;
            element.isPreference = await isPreferredService(customerId, serviceId);
        }
        res.json(service);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching service" });
    }
  };

  exports.getEmployeeWithPreference = async (req, res) => {
    const customerId = req.params.customerId;
    try{
        const employee = await Employee.aggregate([
            {
              $project: {
                _id: 1,
                name: 1,
                firstname: 1, 
                profile: 1,
                isPreference: 2     
              },
            }
        ]);
        for (const element of employee) {
            const employeeId = element._id;
            element.isPreference = await isPreferredEmployee(customerId, employeeId);
        }
        res.json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching service" });
    }
  };
