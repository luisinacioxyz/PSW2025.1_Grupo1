const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const { authenticateJWT, authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Validações
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

// Rotas de autenticação
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, passport.authenticate('local', { session: false }), authController.loginSuccess);
router.get('/me',         authenticateJWT,  authController.me);
router.put('/profile',    [
  authenticateJWT,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').optional().isEmail().withMessage('Email inválido')
], authController.updateProfile);
router.post('/change-password', [
  authenticateJWT,
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres')
], authController.changePassword);

module.exports = router;
