const Ad = require("../models/ad.model.js");

// Create and Save a new Ad
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Ad
  const ad = new Ad({
    adId: req.body.adId,
    title: req.body.title,
    active: req.body.active,
    url: req.body.url,
    location: req.body.location,
    price: req.body.price,
    postedTimestamp: req.body.postedTimestamp,
  });

  // Save Ad in the database
  Ad.create(ad, (err, data) => {
    if (err)
      if (err.code == "ER_DUP_ENTRY") {
        res.status(409).send({
          code: err.code, 
          message: err.message || "Ad already stored in the database.",
        });
      } else
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Ad.",
        });
    else {
      res.send(data);
    }
  });
};

// Retrieve all Ads from the database.
exports.findAll = (req, res) => {
  Ad.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving ads.",
      });
    else res.send(data);
  });
};

// Find a single Ad with a adId
exports.findOne = (req, res) => {
  Ad.findById(req.params.adId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Ad with id ${req.params.adId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Ad with id " + req.params.adId,
        });
      }
    } else res.send(data);
  });
};

// Update a Ad identified by the adId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Ad.updateById(req.params.adId, new Ad(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Ad with id ${req.params.adId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Ad with id " + req.params.adId,
        });
      }
    } else res.send(data);
  });
};

// Delete a Ad with the specified adId in the request
exports.delete = (req, res) => {
  Ad.remove(req.params.adId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Ad with id ${req.params.adId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Ad with id " + req.params.adId,
        });
      }
    } else res.send({ message: `Ad was deleted successfully!` });
  });
};

// Delete all Ads from the database.
exports.deleteAll = (req, res) => {
  Ad.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all ads.",
      });
    else res.send({ message: `All Ads were deleted successfully!` });
  });
};
