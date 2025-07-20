const express = require('express');
const { users } = require('../data/mockData');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Listar usuários (admin apenas)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Remover senhas dos usuários
    const safeUsers = users.map(({ password, ...user }) => user);
    
    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = safeUsers.slice(startIndex, endIndex);

    res.json({
      users: paginatedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(safeUsers.length / limit),
        totalUsers: safeUsers.length,
        hasNextPage: endIndex < safeUsers.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/users/:id - Obter usuário específico (público, sem senha)
router.get('/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
