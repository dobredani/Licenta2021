module.exports = app => {
    const ads = require("../controllers/ad.controller.js");
  
    // Create a new Ad
    app.post("/ads", ads.create);
  
    // Retrieve all ads
    app.get("/ads", ads.findAll);
  
    // Retrieve a single Ad with adId
    app.get("/ads/:adId", ads.findOne);
  
    // Update a Ad with adId
    app.put("/ads/:adId", ads.update);
  
    // Delete a Ad with adId
    app.delete("/ads/:adId", ads.delete);
  
    // Delete all Ads
    app.delete("/ads", ads.deleteAll);
  };