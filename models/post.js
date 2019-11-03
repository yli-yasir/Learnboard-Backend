const mongoose = require("mongoose");

let ObjectId = mongoose.Schema.Types.ObjectId;

let postSchema =   new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 150,
      trim: true
    },
    type: { type: String, required: true, enum: ["offer", "request"] },
    author: { name: String, id: ObjectId },
    languages: { type: [{ type: String, maxLength: 50 }], required: true },
    shortDescription: {
      type: String,
      required: true,
      minLength: 50,
      maxLength: 500,
      trim: true
    },
    description: {
      type: String,
      required: true,
      minLength: 50,
      maxLength: 2000,
      trim: true
    }
  },
  { timestamps: true }
);

postSchema.statics.search = function(q,type,author,startFromIndex){
//Build a filter accordingly, and use it to execute the query.
let filter = {};

//If there is a specified query i.e. search term
if (q) {
  //get a list of words of the query
  const searchWords = q
    .split(" ")
    .filter(word => word !== "")
    .map(word => word.trim());

  //construst a pattern to use in the regular expression
  let pattern = "";

  searchWords.forEach(word => {
    pattern += `(?=.*\\b${word}.*\\b)`;
  });

  pattern += ".+";

  filter.topic = { $regex: pattern, $options: 'i' } }


// If there is a postType,and that type isn't 'all' we consider it.
// ( no need to consider postType if we are looking for everything)
if (type && type !== 'all') {
  filter.postType = type;
}

if (author) {
  filter.authorStitchUserId = by;
}

if (startFromIndex) {
  filter._id = { $lt: continueFrom };
}

console.log("search filter:");
console.log(filter);

return this.find(filter);
}

module.exports = mongoose.model(
  "post",
  postSchema
);
