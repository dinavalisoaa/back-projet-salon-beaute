const Customer = require('../models/customer');
const Utils = require('../utils')
const Sex = require('../models/sex');
const jwt = require('jsonwebtoken');

// const { sendScheduledEmail } = require('./emailController');

// Create a new customer
exports.createCustomer = async (req, res) => {
        const {  name,password,email } = req.body;
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

        // const date = new Date(2024,1,1,14,10);
        // const recipient = 'lalaina.nancia64@gmail.com';
        // const subject = 'Test email programme';
        // const message = 'Test email programme sur express.js';

        // await sendScheduledEmail({ body: { date, recipient, subject, message } }, null);

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
        newCustomer.password = Utils.encryptPassword(customer.password);
        newCustomer.profile = null;
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.appointmentHistory = async (req, res) => {
        
};



