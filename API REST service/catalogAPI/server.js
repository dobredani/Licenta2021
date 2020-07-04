//https://bezkoder.com/node-js-rest-api-express-mysql/
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

app.use(cors({origin:true,credentials: true}));

// allow CORS
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');

  if (req.method === "OPTIONS") {
    return res.status(200).end();
}
  next();
});

// https://expressjs.com/en/resources/middleware/cors.html
app.options('*', cors()) // enable pre-flight request 

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to OLX Scraper." });
});

require("./app/routes/image.routes.js")(app);
require("./app/routes/ad.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
