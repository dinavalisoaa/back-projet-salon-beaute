const Employee = require('../models/employee');
const Utils = require('../utils')

// Create a new employee
exports.registration = async (req, res) => {
  const employee = req.body;
  try {
      if(employee.name == null || employee.firstname == null || employee.dateOfBirth == null || employee.sex == null || employee.address == null ||  employee.phoneNumber == null || employee.email == null || employee.password == null || employee.confirmationPassword == null){
        throw new Error("Veuillez remplir les champs obligatoires");
      }
      if(employee.password != employee.confirmationPassword){
        throw new Error("Mot de passe de confirmation invalide");
      }
      if(!Utils.isValidEmail(employee.email)){
        throw new Error("Adresse email invalide");
      }
      const newEmployee = new Employee(employee);
      newEmployee.password = Utils.encryptPassword(employee.password);
      newEmployee.profile = null;
      newEmployee.status = 0;
      const savedEmployee = await newEmployee.save();
      res.status(201).json(savedEmployee);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Get all employee
exports.getAllEmployee = async (req, res) => {
  try {
    const employee = await Employee.find().populate('sex');
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching employee' });
  }
};

//Get active employee
exports.getActiveEmployee = async (req, res) => {
  try {
    const employee = await Employee.find({ status: { $gt: 0 } }).populate('sex');
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching employee' });
  }
};

// Get a specific employee by ID
exports.getEmployee = async (req, res) => {
 const employeeId = req.params.id;
 try {
   const employee = await Employee.findById(employeeId).populate('sex');
     if (!employee) {
       return res.status(404).json({ error: 'Employee not found' });
       }
       res.json(employee);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while fetching the employee' });
 }
};

// Update a employee by ID
exports.updateEmployee = async (req, res) => {
 const serviceId = req.params.id;
 const {  price,
  duration,
  commission } = req.body;
 try {
   const updatedEmployee = await Employee.findByIdAndUpdate(
    
   serviceId,{   price,
    duration,
    commission },{ new: true });
   if (!updatedEmployee) {
       return res.status(404).json({ error: 'Employee not found' });
   }
   res.json(updatedEmployee);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while updating the employee' });
 }
};

// Delete a employee by ID
exports.deleteEmployee = async (req, res) => {
 const serviceId = req.params.id;
 console.log(serviceId);
 try {
   const deletedEmployee = await Employee.findByIdAndDelete(serviceId);
   if (!deletedEmployee) {
 return res.status(404).json({ error: 'Employee not found' });
 }
   res.json(deletedEmployee);
 } catch (error) {
    console.log(error);
   res.status(500).json({ error: 'An error occurred while deleting the employee' });
 }
};

//Activate account
exports.activateAccount = async (req, res) => {
  const employeeId = req.params.id;
  const employee = req.body;
  try {
    const updatedEmployee = await Employee.updateOne({ _id: employeeId }, { $set: { status: 1 } });
    if (!updatedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the employee' });
  }
};

//Deactivate account
exports.deactivateAccount = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const updatedEmployee = await Employee.updateOne({ _id: employeeId }, { $set: { status: 0 } });
    if (!updatedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the employee' });
  }
};