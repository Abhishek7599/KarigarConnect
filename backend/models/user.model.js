const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    language: {
      type: String,
      enum: ["en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa"],
      default: "hi",
    },

    craftType: {
      type: String,
      trim: true,
    },

    experienceYears: { type: Number, min: 0, default: 0 },
    businessName: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    certificates: { type: [String], default: [] },
    credentials: { type: [String], default: [] },

    location: {
      state: {
        type: String,
        trim: true,
      },

      district: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
