var mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    unique: 'Article already exists and will not be replaced ({VALUE})',
    required: true
  },
  saved: {
    type: Boolean,
    required: true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// plugin to manage duplicate articles
ArticleSchema.plugin(beautifyUnique);

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
