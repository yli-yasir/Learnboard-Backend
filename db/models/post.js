const mongoose = require("mongoose");
const chalk = require('chalk');
const ObjectId = mongoose.Schema.Types.ObjectId;

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

let postSchema =   new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150,
      trim: true
    },
    type: { type: String, required: true, enum: ["offer", "request"] },
    author: new mongoose.Schema({ name: String, authorId: ObjectId }),
    languages: { type: [{ type: String, maxlength: 50 }], 
    required: true,
  validate: [v => v.length>0,"You must provide at least 1 language" ]},
    shortDescription: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 500,
      trim: true
    },
    description: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 2000,
      trim: true
    },
    location:{
      type:pointSchema,
      required: true 
    }
  },
  { timestamps: true }
);

postSchema.statics.search = function(q,type,author,startFrom,limit){
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
    //assert a maybe any num of any chars - followed by boundary - then word then maybe more chars- then boundary
    pattern += `(?=.*\\b${word}.*\\b)`;
  });

  pattern += ".+";
  //explanation of above regex:

  filter.title = { $regex: pattern, $options: 'i' } }


// If there is a postType,and that type isn't 'all' we consider it.
// ( no need to consider postType if we are looking for everything)
if (type && type !== 'all') {
  filter.type = type;
}

if (author) {
  filter.author = author;
}

if (startFrom) {
  filter._id = { $lt:startFrom };
}

console.log('A posts-search was conducted with the following filter:');
console.log(chalk.yellow(JSON.stringify(filter,null,4)));

return this.find(filter).limit(limit);
}

module.exports = mongoose.model(
  "post",
  postSchema
);
