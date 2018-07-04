var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = Promise;
// Our scraping tools
// request is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;


// Initialize Express
var app = express();

// Configure middleware


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/articles.js");

app.use("/", routes);

// Connect to Mongodb and check for erors
mongoose.connect("mongodb://localhost/wapo_editorials");
var mongoose = mongoose.connection;
mongoose.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

mongoose.once("open", function () {
    console.log("Mongoose connection successful.");
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
