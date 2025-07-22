// models/Rating.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  userId:   { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  rating:   { type: Number,     required: true },
  review:   String,
  usedForCoupon: { type: Boolean, default: false }, // Nova: indica se esta avaliação já foi usada para gerar cupom
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
