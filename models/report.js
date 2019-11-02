const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model(
  "report",
  new mongoose.Schema(
    {
      author: ObjectId,
      post: ObjectId,
      name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 150,
        trim: true
      },
      message: {
        type: String,
        required: true,
        minLength: 50,
        maxLength: 2000,
        trim: true
      }
    },
    { timestamps: true }
  )
);
