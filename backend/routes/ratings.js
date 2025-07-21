const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const ratingController = require('../controllers/RatingController');

const router = express.Router();

// Validações
const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Comentário muito longo'),
  body('courseId').notEmpty().withMessage('ID do curso é obrigatório')
];

router.get('/', optionalAuth, ratingController.getAllRatings);
router.get('/:id', optionalAuth, ratingController.getRatingById);
router.post('/', authenticateToken, ratingValidation, ratingController.createRating);
router.put('/:id', authenticateToken, ratingController.updateRating);
router.delete('/:id', authenticateToken, ratingController.deleteRating);
router.get('/course/:courseId', optionalAuth, ratingController.getRatingsByCourse);
router.get('/user/:userId', optionalAuth, ratingController.getRatingsByUser);

module.exports = router;