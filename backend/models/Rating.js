// models/Rating.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  userId:   { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  rating:   { type: Number,     required: true },
  review:   String,
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
