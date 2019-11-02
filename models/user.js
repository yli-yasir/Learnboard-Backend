const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model(
  "user",
  new mongoose.Schema(
    {
      email: String,
      password: String,
      name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 150,
        trim: true
      },
      contact: {
        type: String,
        required: true,
        minLength: 50,
        maxLength: 1000,
        trim: true
      },
      bio: {
        type: String,
        required: true,
        maxLength: 2000,
        trim: true
      }
    },
    { timestamps: true }
  )
);
