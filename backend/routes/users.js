const express = require('express');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// GET /api/users - Listar todos os usuários (admin)
router.get('/', authenticateJWT, requireAdmin, userController.getAllUsers);

// GET /api/users/:id - Obter um usuário específico (público)
router.get('/:id', userController.getUserById);

module.exports = router;
