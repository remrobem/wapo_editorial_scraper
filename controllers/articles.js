const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const db = require("../models/");

router.get("/", function(req, res) {
  console.log("in the get");

  db.Article.find({})
    .then(function(dbArticle) {
      var articleData = {
        data: dbArticle
      };
      res.render("articles", articleData);
    })
    .catch(function(err) {
      console.log("Error: " + err);
      res.json(err);
    });
});

router.get("/saved", function(req, res) {
  console.log("in the saved get");

  db.Article.find({ saved: true })
    .then(function(dbArticle) {
      var articleData = {
        data: dbArticle
      };
      res.render("articles", articleData);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/save", function(req, res) {
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

router.post("/deletenote", function(req, res) {
  db.Article.findByIdAndUpdate(
    { _id: req.query.article },
    { $pull: { notes: { _id: req.query.note } } }
  )
    .then(function(dbArticle) {
      res.json("deleted");
      // res.redirect("/");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      console.log(`error: ${err}`);
      res.json(err);
    });
});

router.post("/scrape", function(req, res) {
  request("https://www.washingtonpost.com/opinions/", function(
    error,
    response,
    body
  ) {
    var $ = cheerio.load(body);

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


      db.Article.create(result)
        .then(dbArticle => {})
        .catch(err => {
          console.log(err);
          res.json(err);
        });
    });

    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});

router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/article/:id", function(req, res) {
  console.log("id in server", req.params.id);

  db.Article.findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/note/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  let body = JSON.stringify(req.body);
  console.log(`note insert ${body}`);
  console.log(req.params.id);

  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { notes: req.body } }
  )
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
