const Song = require('../models/song');

// Create a new song
exports.createSong = async (req, res) => {
 const { title, description } = req.body;
 try {
   const song = new Song({ title, description });
   const savedSong = await song.save();
   res.status(201).json(savedSong);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while creating the object' });
 }
};

// Get all songs
exports.getAllSong = async (req, res) => {
 try {
   const song = await Song.find();
   res.json(song);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while fetching data' });
 }
};

// Get a specific song by ID
exports.getSong = async (req, res) => {
 const songId = req.params.id;
 try {
   const song = await Song.findById(songId);
     if (!song) {
       return res.status(404).json({ error: 'Song not found' });
       }
       res.json(song);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while fetching the object' });
 }
};

// Update a song by ID
exports.updateSong = async (req, res) => {
 const songId = req.params.id;
 const { title, description } = req.body;
 try {
   const updatedSong = await Song.findByIdAndUpdate(
   songId,{ title, description },{ new: true });
   if (!updatedSong) {
       return res.status(404).json({ error: 'Song not found' });
   }
   res.json(updatedSong);
 } catch (error) {
   res.status(500).json({ error: 'An error occurred while updating the object' });
 }
};

// Delete a song by ID
exports.deleteSong = async (req, res) => {
 const songId = req.params.id;
 console.log(songId);
 try {
   const deletedSong = await Song.findByIdAndDelete(songId);
   if (!deletedSong) {
 return res.status(404).json({ error: 'Song not found' });
 }
   res.json(deletedSong);
 } catch (error) {
    console.log(error);
   res.status(500).json({ error: 'An error occurred while deleting the object' });
 }
};