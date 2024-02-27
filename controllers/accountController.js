const { getUser } = require("../middleware/authMiddleware");
const Account = require("../models/accountMovement");
const Customer = require("../models/customer");
const jwt = require("jsonwebtoken");

const { ObjectId } = require("mongodb");
// Create a new song
exports.createAccount = async (req, res) => {
  const { date, description, customer, debit, credit } = req.body;
  console.log(req.body);
  try {
    const state = await Account.aggregate([
      {
        $match: {
          customer: new ObjectId(customer._id),
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

    let stateAccount = 0;

    if (state.length > 0) {
      stateAccount = state[0].total_credit - state[0].total_debit;

    }

    if (stateAccount < debit) {
      res.status(400).json({ error: "Compte insuffisant" });
      return;
    }

    const song = new Account({ date, description, customer, debit, credit });

    const savedAccount = await song.save();
    res
      .status(201)
      .json({ message: "Mouvement de compte effectuee", savedAccount });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the song", error });
  }
};

// Get all songs
exports.getAllAccount = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, "your-secret-key");
    const song = await Account.find({
      customer: user.userId,
    });
    res.json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
// Get all songs
exports.getState = async (req, res) => {
  try {
    const song = await Account.aggregate([
      {
        $match: {
          customer: new ObjectId(req.query.id),
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
    res.status(500).json({ error: "An error occurred while fetching data" });
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
