const Service = require("../models/service");

// Create a new song
exports.createService = async (req, res) => {
  const service = req.body;
  try {
    const newService = new Service(service);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the service" });
  }
};

exports.sumService = async (req, res) => {
  const body = req.body;
  try {
    // const song = new Service({
    //   name,
    //   price,
    //   duration,
    //   commission,
    //   illustration,
    // });

    // const savedService = await song.save();
    res.status(201).json(body);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the song" });
  }
};

// Get all songs
exports.getAllService = async (req, res) => {
  try {
    var json_filter = {};
    if (req.query.name) {
      json_filter.name = {
        $regex: ".*" + req.query.name + ".*",
      };
    }
    if (req.query.price) {
      json_filter.price = req.query.price;
    }
    if (req.query.duration) {
      json_filter.duration = req.query.duration;
    }
    if (req.query.commission) {
      json_filter.commission = req.query.commission;
    }

    const service = await Service.find(json_filter);
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching service" });
  }
};

// Get a specific song by ID
exports.getService = async (req, res) => {
  const serviceId = req.params.id;
  try {
    const song = await Service.findById(serviceId);
    if (!song) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(song);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the song" });
  }
};

// Update a song by ID
exports.updateService = async (req, res) => {
  const serviceId = req.params.id;
  const { name, price, duration, commission, illustration } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { price, name, illustration, duration, commission },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(updatedService);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the song" });
  }
};

// Delete a song by ID
exports.deleteService = async (req, res) => {
  const serviceId = req.params.id;
  console.log(serviceId);
  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(deletedService);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the song" });
  }
};
