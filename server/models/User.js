const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      enum: ['GHS', 'USD', 'EUR', 'GBP'],
      default: 'GHS',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
