const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
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
);
 


const projection  = {email: 0, password: 0,createdAt:0,updatedAt:0,__v:0};


userSchema.statics.redactedFind = function(filter){
  return this.find(filter).select(projection);
}

userSchema.statics.redactedFindById = function(id){
  return this.findById(id).select(projection);
}

module.exports = mongoose.model(
  "user",
  userSchema
);


