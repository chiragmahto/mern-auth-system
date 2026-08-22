const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {

    name: {
      type: String, required: true, trim: true
    },

    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true
    },

    password: {
      type: String, required: true
    },

    role: {
      type: String,
      enum: [ "user", "admin"
      ],
      default: "user"
    },

    isVerified: {
      type: Boolean, default: false
    },

    isBlocked: {
      type: Boolean, default: false
    },

    gender: {
      type: String, default: ""
    },

    country: {
      type: String,
      default: ""
    },

    state: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    },

    photo: {
      type: String,
      default: ""
    },

    idCard: {
      type: String,
      default: ""
    },

    resetToken: {
      type: String,
      default: null
    },

    resetTokenExpire: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);
