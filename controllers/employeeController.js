const Employee = require('../models/employee');

// Create a new song
exports.createEmployee = async (req, res) => {
 const {  name,
  price,
  duration,
  commission} = req.body;
 try {
   const song = new Employee({ name,price,duration,
    commission});
   const savedEmployee = await song.save();
   res.status(201).json(savedEmployee);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while creating the song' });
 }
};

// Get all songs
exports.getAllEmployee = async (req, res) => {
 try {
   const song = await Employee.find();
   res.json(song);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while fetching song' });
 }
};

// Get a specific song by ID
exports.getEmployee = async (req, res) => {
 const serviceId = req.params.id;
 try {
   const song = await Employee.findById(serviceId);
     if (!song) {
       return res.status(404).json({ error: 'Employee not found' });
       }
       res.json(song);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while fetching the song' });
 }
};

// Update a song by ID
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
   res.status(500).json({ error: 'An error occurred while updating the song' });
 }
};

// Delete a song by ID
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
   res.status(500).json({ error: 'An error occurred while deleting the song' });
 }
};