const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const courseController = require('../controllers/CourseController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const courseValidation = [
  body('title').trim().isLength({ min: 3 }).withMessage('Título deve ter pelo menos 3 caracteres'),
  body('platform').notEmpty().withMessage('Plataforma é obrigatória'),
  body('url').isURL().withMessage('URL inválida'),
  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Descrição muito longa'),
  body('imageUrl').optional().isURL().withMessage('URL da imagem inválida')
];

router.get('/', optionalAuth, courseController.listCourses);
router.get('/:id', optionalAuth, courseController.getCourse);
router.post('/', authenticateToken, courseValidation, courseController.createCourse);
router.put('/:id', authenticateToken, courseValidation, courseController.updateCourse);
router.delete('/:id', authenticateToken, courseController.deleteCourse);
router.get('/platforms/list', courseController.listPlatforms);
router.get('/user/:userId', optionalAuth, courseController.getCoursesByUser);

module.exports = router;