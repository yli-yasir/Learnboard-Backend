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
        minlength: 3,
        maxlength: 150,
        trim: true
      },
      message: {
        type: String,
        required: true,
        minlength: 50,
        maxlength: 2000,
        trim: true
      }
    },
    { timestamps: true }
  )
);
