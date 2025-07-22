// routes/coupons.js
const express = require('express');
const { body, param } = require('express-validator');
const couponController = require('../controllers/couponController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

const couponValidation = [
  body('courseId').optional().isMongoId().withMessage('ID do curso inválido'),
  body('platform').notEmpty().withMessage('Plataforma é obrigatória'),
  body('code').trim().isLength({ min: 3, max: 20 }).withMessage('Código deve ter entre 3 e 20 caracteres'),
  body('discount').isFloat({ min: 1, max: 100 }).withMessage('Desconto deve ser entre 1 e 100%'),
  body('expiresAt').isISO8601().withMessage('Data de expiração inválida')
];

const platformValidation = [
  param('platform').notEmpty().withMessage('Plataforma é obrigatória')
];

// Rotas protegidas
router.get('/my', authenticateJWT, couponController.getUserCoupons);
router.post('/', authenticateJWT, couponValidation, couponController.createCoupon);
router.get('/eligibility/:platform', authenticateJWT, platformValidation, couponController.checkCouponEligibility);
router.get('/validate/:code', couponController.validateCoupon);
router.post('/use/:code', authenticateJWT, couponController.useCoupon);
router.delete('/:id', authenticateJWT, couponController.deleteCoupon);

module.exports = router;
