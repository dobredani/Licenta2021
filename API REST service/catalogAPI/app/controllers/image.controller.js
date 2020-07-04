const Image = require("../models/image.model.js");

// Create and Save a new Image
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Image
    const image = new Image({
      fk_olx_ad_id: req.body.fk_olx_ad_id,
      image_path: req.body.image_path,
      label: req.body.label
    });
  
    // Save Image in the database
    Image.create(image, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Image."
        });
      else res.send(data);
    });
  };

// Retrieve all Images from the database.
exports.findAll = (req, res) => {
  Image.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving images."
      });
    else res.send(data);
  });
};

// Find a single Image with a imageId
exports.findOne = (req, res) => {
  Image.findById(req.params.imageId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Image with id ${req.params.imageId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Image with id " + req.params.imageId
        });
      }
    } else res.send(data);
  });
};

// Update a Image identified by the imageId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Image.updateById(
    req.params.imageId,
    new Image(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Image with id ${req.params.imageId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Image with id " + req.params.imageId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Image with the specified imageId in the request
exports.delete = (req, res) => {
  Image.remove(req.params.imageId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Image with id ${req.params.imageId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Image with id " + req.params.imageId
        });
      }
    } else res.send({ message: `Image was deleted successfully!` });
  });
};

// Delete all Images from the database.
exports.deleteAll = (req, res) => {
  Image.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all images."
      });
    else res.send({ message: `All Images were deleted successfully!` });
  });
};