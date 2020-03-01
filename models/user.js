const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, select: false, required: true, trim: true },
    password: { type: String, select: false, required: true, trim: true },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150,
      trim: true
    },
    contact: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true
    },
    bio: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
      select: false 
    },
    role: {
      type: String,
      required: true,
      default: 'member',
      enum: ['member', 'admin'],
      select: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "user",
  userSchema
);


