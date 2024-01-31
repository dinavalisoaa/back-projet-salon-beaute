const Service = require('../models/service');

// Create a new song
exports.createService = async (req, res) => {
 const {  name,
  price,
  duration,
  commission} = req.body;
 try {
   const song = new Service({ name,price,duration,
    commission});
   const savedService = await song.save();
   res.status(201).json(savedService);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while creating the song' });
 }
};

// Get all songs
exports.getAllService = async (req, res) => {
 try {
   const song = await Service.find();
   res.json(song);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while fetching song' });
 }
};

// Get a specific song by ID
exports.getService = async (req, res) => {
 const songId = req.params.id;
 try {
   const song = await Service.findById(songId);
     if (!song) {
       return res.status(404).json({ error: 'Service not found' });
       }
       res.json(song);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while fetching the song' });
 }
};

// Update a song by ID
exports.updateService = async (req, res) => {
 const songId = req.params.id;
 const { title, description } = req.body;
 try {
   const updatedService = await Service.findByIdAndUpdate(
   songId,{ title, description },{ new: true });
   if (!updatedService) {
       return res.status(404).json({ error: 'Service not found' });
   }
   res.json(updatedService);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while updating the song' });
 }
};

// Delete a song by ID
exports.deleteService = async (req, res) => {
 const songId = req.params.id;
 console.log(songId);
 try {
   const deletedService = await Service.findByIdAndDelete(songId);
   if (!deletedService) {
 return res.status(404).json({ error: 'Service not found' });
 }
   res.json(deletedService);
 } catch (error) {
    console.log(error);
   res.status(500).json({ error: 'An error occurred while deleting the song' });
 }
};