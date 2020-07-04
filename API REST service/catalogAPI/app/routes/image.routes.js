module.exports = app => {
    const images = require("../controllers/image.controller.js");
  
    // Create a new Image
    app.post("/images", images.create);
  
    // Retrieve all Images
    app.get("/images", images.findAll);
  
    // Retrieve a single Image with imageId
    app.get("/images/:imageId", images.findOne);
  
    // Update a Image with imageId
    app.put("/images/:imageId", images.update);
  
    // Delete a Image with imageId
    app.delete("/images/:imageId", images.delete);
  
    // Create a new Image
    app.delete("/images", images.deleteAll);
  };