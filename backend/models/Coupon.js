// models/Coupon.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId:  { type: Schema.Types.ObjectId, ref: 'Course', required: false }, // Opcional para cupons de plataforma
  platform:  { type: String, required: true }, // Nova: plataforma do cupom (ex: "Udemy", "Coursera")
  code:      { type: String, required: true, unique: true },
  discount:  { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  isUsed:    { type: Boolean, default: false }, // Nova: controla se cupom foi usado
  usedAt:    { type: Date }, // Nova: data de uso
  usedBy:    { type: Schema.Types.ObjectId, ref: 'User' }, // Nova: quem usou (pode ser diferente do dono)
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
