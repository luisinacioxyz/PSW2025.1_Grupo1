// models/Coupon.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  code:      { type: String,     required: true, unique: true },
  discount:  { type: Number,     required: true },
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
