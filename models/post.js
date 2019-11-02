const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model(
  "post",
  new mongoose.Schema(
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
  )
);
