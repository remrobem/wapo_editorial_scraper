var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools
// request is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

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
// var routes = require("./controllers/controller.js");

// app.use(routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/wapo_editorials");

// Routes


app.get("/", function(req, res) {
console.log("in the get")
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
    //    console.log(dbArticle);
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);
       var articleData = {
         data: dbArticle
       }
    //   console.log('Article Data ' + articleData.data);
  
       res.render('index', articleData);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        console.log("Error: " + err)
        res.json(err);
      });
  });
  


app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    request("https://www.washingtonpost.com/opinions/", function (error, response, body) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        // console.log(body)
        var $ = cheerio.load(body);

        // db.Article.on('index', err => {
        //     if (err) {
        //         console.error('Indexes could not be created:', err);
        //         return;
        //     }
        //     console.log('before loop')
        $(".story-body").each(function (i, element) {
            // console.log('after loop')
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object



            result.title = $(this)
                .children(".story-headline")
                .children("h3")
                .children("a")
                .text();
            result.link = $(this)
                .children(".story-headline")
                .children("h3")
                .children("a")
                .attr("href");
            result.description = $(this)
                .children(".story-description")
                .children("p")
                .text();


            // db.Article.once('index', function (error) {
            //     assert.ifError(error);
            db.Article.create(result)
                .then(dbArticle => {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                // .catch(function (err) {
                // If an error occurred, send it to the client
                // res.send(err);
                .catch(err => {
                    console.log('---------------------------------------')
                    console.log(err);
                    // console.log(err.message);
                });

            // });

        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
