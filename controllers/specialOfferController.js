const SpecialOffer = require("../models/specialOffer");
const Customer = require("../models/customer");
const Utils = require("../utils");
const notificationController = require("./notificationController");

// Create a new specialOffer
exports.createSpecialOffer = async (req, res) => {
  const specialOffer = req.body;
  try {
    const newSpecialOffer = new SpecialOffer(specialOffer);
    const savedSpecialOffer = await newSpecialOffer.save();
    const customers = await Customer.find();
    const recipient = [];
    for (const customer of customers) {
      recipient.push({ id: customer._id, status: 0 });
    }
    const notification = {
      date: newSpecialOffer.launchDate,
      content: newSpecialOffer.message,
      sender: newSpecialOffer.sender,
      recipient: recipient
    }
    notificationController.sendNotification({ body: notification }, null);
    res.status(201).json(savedSpecialOffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all specialOffers
exports.getAllSpecialOffer = async (req, res) => {
  try {
    const specialOffer = await SpecialOffer.find().populate('sender').sort({ launchDate: -1 }).exec();
    res.json(specialOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};