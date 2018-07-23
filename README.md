# wapo_editorial_scraper

# Op-Ed scraper for The Washington Post

## Description

Scrape Op-Ed articles from The Washington Post. Save articles as you want and add notes to them for future reference.

## Getting Started

### Prerequsites

1. Node.js must be installed (https://nodejs.org/en/download/)
1. MongoDB must be installed and running



### Installation

1. Clone repository wapo_editorial_scraper from git@github.com:remrobem/wapo_editorial_scraper.git
1. MongoDB is used locally as the database. You need to have MongoDB installed and running via the `mongod` command. 
1. Open a terminal session for the directory where the application was cloned to

1. run *npm install* to install the dependencies
    * The dependancies are:
        *  "body-parser": "^1.18.3",
        * "cheerio": "^1.0.0-rc.2",
        * "express": "^4.16.3",
        * "express-handlebars": "^3.0.0",
        * "mongoose": "^5.1.6",
        * "mongoose-beautiful-unique-validation": "^7.1.1",
        * "request": "^2.87.0"
1. run `node server.js`
1. In a browser, go to localhost:3001 or the port number provided after you run the *node server.js* command

## Database

1. MongoDB is the backend database. 

1. The datebase created and used is wapo_editorials

1. There is one collection named articles.

1. The applicaton uses Mongoose for all DB access.

## Using the Application

The application consist of 2 pages, Home and Saved Articles, and a Notes modal:

1. Home
    1. Allows articles to be scraped form The Washington Post
    1. The scraped articles are displayed
    1. The article title can be clicked to go to the actual article
    1. Articles can be saved or removed from saved
    1. Saved articles can have notes added

![Home](/homepage.png?raw=true "Home Page")

1. Saved Articles
    1. Only Saved articles are displayed
    1. The article title can be clicked to go to the actual article
    1. Articles can be removed from saved
    1. Articles can have notes added

![Home](/savedarticles.png?raw=true "Saved Articles")

1. Notes modal
    1. Article notes are displayed
    1. Additional notes can be added
    1. Existing notes can be removed

![Home](/notes.png?raw=true "Notes")