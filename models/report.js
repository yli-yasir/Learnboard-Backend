const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model(
  "report",
  new mongoose.Schema(
    {
      author: new mongoose.Schema({ name: String, authorId: ObjectId }),
      post: new mongoose.Schema({ title: String, postId: ObjectId }),
      title: {
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
