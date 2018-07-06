const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const db = require("../models/");

router.get("/", function(req, res) {
  console.log("in the get");
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      //    console.log(dbArticle);
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);
      var articleData = {
        data: dbArticle
      };
      //   console.log('Article Data ' + articleData.data);

      res.render("articles", articleData);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      console.log("Error: " + err);
      res.json(err);
    });
});

router.get("/saved", function(req, res) {
  console.log("in the saved get");
  // Grab every document in the Articles collection
  db.Article.find({ saved: true })
    .then(function(dbArticle) {
      var articleData = {
        data: dbArticle
      };
      console.log(JSON.stringify(articleData));
      res.render("articles", articleData);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      console.log("Error: " + err);
      res.json(err);
    });
});

router.post("/save", function(req, res) {
  console.log(req.body);
  console.log(req.body.id);

  db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })

    .then(function(dbArticle) {
      res.json("saved");
      // res.redirect("/");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/delete", function(req, res) {
  console.log(req.body);
  console.log(req.body.id);

  db.Article.updateOne({ _id: req.body.id }, { $set: { saved: false } })

    .then(function(dbArticle) {
      res.json("deleted");
      // res.redirect("/");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://www.washingtonpost.com/opinions/", function(
    error,
    response,
    body
  ) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    // console.log(body)
    var $ = cheerio.load(body);

    // db.Article.on('index', err => {
    //     if (err) {
    //         console.error('Indexes could not be created:', err);
    //         return;
    //     }
    //     console.log('before loop')
    $(".story-body").each(function(i, element) {
      // console.log('after loop')
      var result = {};

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
      result.saved = false;

      // db.Article.once('index', function (error) {
      //     assert.ifError(error);
      db.Article.create(result)
        .then(dbArticle => {
          // View the added result in the console
          // console.log(dbArticle);
          // return res.redirect('/articles')
        })
        // .catch(function (err) {
        // If an error occurred, send it to the client
        // res.send(err);
        .catch(err => {
          console.log("---------------------------------------");
          console.log(err);
          // console.log(err.message);
        });

      // });
    });
    // load the saved articles to the screen
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
    // If we were able to successfully scrape and save an Article, send a message to the client
    // res.send("Scrape Complete");
    // res.render('articles', articleData);
  });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/article/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function(dbArticle) {
      console.log(dbArticle);
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/note/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  let body = JSON.stringify(req.body);
  console.log(`note insert ${body}`);
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log(`add note to article: ${req.params.id} ${dbNote._id}`);
      return db.Article.findByIdAndUpdate(
        req.params.id,
        { $push: { note: dbNote._id } },
        { new: true, upsert: true }
      );
    })
    // .then(function (dbArticle) {
    //     // If we were able to successfully update an Article, send it back to the client
    //     res.json(dbArticle);
    // })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

module.exports = router;
