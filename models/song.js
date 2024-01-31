const mongoose = require('mongoose');

const songData = new mongoose.Schema({
 title: String,
 description: String,
});

const Song = mongoose.model('Song', songData);

module.exports = Song;