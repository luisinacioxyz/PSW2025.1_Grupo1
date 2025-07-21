// models/Course.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  title:       { type: String, required: true },
  platform:    String,
  url:         String,
  price:       Number,
  description: String,
  imageUrl:    String,
  rating:      { type: Number, default: 0 },
  totalRatings:{ type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
