const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    email: {type:String,select: false,required: true, trim: true},
    password: {type:String,select: false,required: true, trim: true},
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
);
 
module.exports = mongoose.model(
  "user",
  userSchema
);


