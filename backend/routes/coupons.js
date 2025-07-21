// routes/coupons.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const couponController = require('../controllers/couponController');

const router = express.Router();

const couponValidation = [
  body('courseId').notEmpty().withMessage('ID do curso é obrigatório'),
  body('code').trim().isLength({ min: 3, max: 20 }).withMessage('Código deve ter entre 3 e 20 caracteres'),
  body('discount').isFloat({ min: 1, max: 100 }).withMessage('Desconto deve ser entre 1 e 100%'),
  body('expiresAt').isISO8601().withMessage('Data de expiração inválida')
];

router.get('/my', couponController.getUserCoupons);
router.post('/', couponValidation, couponController.createCoupon);
// …

module.exports = router;
