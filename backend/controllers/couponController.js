const { validationResult } = require('express-validator');
const Coupon  = require('../models/Coupon');
const Course  = require('../models/course');

exports.getUserCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ userId: req.user.id }).populate('courseId');
    res.json({ coupons, total: coupons.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.createCoupon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { courseId, code, discount, expiresAt } = req.body;
  try {
    if (!await Course.findById(courseId)) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    if (await Coupon.findOne({ code: code.toUpperCase() })) {
      return res.status(400).json({ error: 'Código de cupom já existe' });
    }
    if (new Date(expiresAt) <= new Date()) {
      return res.status(400).json({ error: 'Data de expiração deve ser no futuro' });
    }

    const coupon = new Coupon({
      userId: req.user.id,
      courseId,
      code: code.toUpperCase(),
      discount,
      expiresAt
    });
    await coupon.save();

    res.status(201).json({ message: 'Cupom criado com sucesso', coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      code: req.params.code.toUpperCase(),
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).populate('courseId');
    if (!coupon) {
      return res.status(404).json({ error: 'Cupom inválido, expirado ou já utilizado', valid: false });
    }
    res.json({ valid: true, coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.useCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      {
        code: req.params.code.toUpperCase(),
        isUsed: false,
        expiresAt: { $gt: new Date() }
      },
      { isUsed: true, usedBy: req.user.id, usedAt: new Date() },
      { new: true }
    ).populate('courseId');
    if (!coupon) {
      return res.status(404).json({ error: 'Cupom inválido, expirado ou já utilizado' });
    }
    res.json({ message: 'Cupom utilizado com sucesso', coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Cupom não encontrado' });

    if (coupon.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    await coupon.remove();
    res.json({ message: 'Cupom excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
