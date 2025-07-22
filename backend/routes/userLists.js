const express = require('express');
const { body } = require('express-validator');
const { authenticateJWT } = require('../middleware/auth');
const controller = require('../controllers/UserlistController');

const router = express.Router();

router.get('/my', authenticateJWT, controller.getMyList);

router.post('/add',
  authenticateJWT,
  [body('courseId').notEmpty().withMessage('ID do curso é obrigatório')],
  controller.addCourseToList
);

router.delete('/remove/:courseId', authenticateJWT, controller.removeCourseFromList);

router.get('/:userId', controller.getUserList);

module.exports = router;
