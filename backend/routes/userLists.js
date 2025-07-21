const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const controller = require('../controllers/UserlistController');

const router = express.Router();

router.get('/my', authenticateToken, controller.getMyList);

router.post('/add',
  authenticateToken,
  [body('courseId').notEmpty().withMessage('ID do curso é obrigatório')],
  controller.addCourseToList
);

router.delete('/remove/:courseId', authenticateToken, controller.removeCourseFromList);

router.get('/:userId', controller.getUserList);

module.exports = router;
