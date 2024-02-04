const Account = require("../models/accountMovement");
const Customer = require("../models/customer");
const {ObjectId}=require('mongodb');
// Create a new song
exports.createAccount = async (req, res) => {
  const { date, description, customer, debit, credit } = req.body;
  try {
    const song = new Account({ date, description, customer, debit, credit });
    const savedAccount = await song.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the song",error });
  }
};

// Get all songs
exports.getAllAccount = async (req, res) => {
  try {
    const song = await Account.find();
    res.json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching song" });
  }
};
// Get all songs
exports.getState = async (req, res) => {
  try {
    const song = await Account.aggregate([
      {
        $match: {
          customer: new ObjectId(
            req.query.id
          ),
        },
      },
      {
        $group: {
          _id: "$customer",
          total_debit: {
            $sum: "$debit",
          },
          total_credit: {
            $sum: "$credit",
          },
        },
      },
    ]);
    
    res.json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching song" });
  }
};

// Get a specific song by ID
exports.getAccount = async (req, res) => {
  const songId = req.params.id;
  try {
    const song = await Account.findById(songId);
    if (!song) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(song);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the song" });
  }
};

// Update a song by ID
exports.updateAccount = async (req, res) => {
  const songId = req.params.id;
  const { title, description } = req.body;
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      songId,
      { title, description },
      { new: true }
    );
    if (!updatedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(updatedAccount);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the song" });
  }
};

// Delete a song by ID
exports.deleteAccount = async (req, res) => {
  const songId = req.params.id;
  console.log(songId);
  try {
    const deletedAccount = await Account.findByIdAndDelete(songId);
    if (!deletedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(deletedAccount);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the song" });
  }
};
