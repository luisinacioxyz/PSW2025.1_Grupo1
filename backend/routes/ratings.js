const express = require('express');
const { body, validationResult } = require('express-validator');
const { ratings, courses, generateId } = require('../data/mockData');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validações
const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Comentário muito longo'),
  body('courseId').notEmpty().withMessage('ID do curso é obrigatório')
];

// Função para atualizar rating médio do curso
function updateCourseRating(courseId) {
  const courseRatings = ratings.filter(r => r.courseId === courseId);
  const courseIndex = courses.findIndex(c => c.id === courseId);
  
  if (courseIndex !== -1) {
    if (courseRatings.length === 0) {
      courses[courseIndex].rating = 0;
      courses[courseIndex].totalRatings = 0;
    } else {
      const sum = courseRatings.reduce((acc, r) => acc + r.rating, 0);
      courses[courseIndex].rating = sum / courseRatings.length;
      courses[courseIndex].totalRatings = courseRatings.length;
    }
  }
}

// GET /api/ratings - Listar todas as avaliações (público)
router.get('/', optionalAuth, (req, res) => {
  try {
    const { courseId, userId, page = 1, limit = 10 } = req.query;
    
    let filteredRatings = [...ratings];

    // Filtrar por curso
    if (courseId) {
      filteredRatings = filteredRatings.filter(rating => rating.courseId === courseId);
    }

    // Filtrar por usuário
    if (userId) {
      filteredRatings = filteredRatings.filter(rating => rating.userId === userId);
    }

    // Ordenar por data (mais recentes primeiro)
    filteredRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRatings = filteredRatings.slice(startIndex, endIndex);

    res.json({
      ratings: paginatedRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredRatings.length / limit),
        totalRatings: filteredRatings.length,
        hasNextPage: endIndex < filteredRatings.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Erro ao listar avaliações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/ratings/:id - Obter avaliação específica (público)
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const ratingId = req.params.id;
    const rating = ratings.find(r => r.id === ratingId);
    
    if (!rating) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json(rating);
  } catch (error) {
    console.error('Erro ao obter avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/ratings - Criar nova avaliação (autenticado)
router.post('/', authenticateToken, ratingValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, rating, review } = req.body;
    const userId = req.user.id;

    // Verificar se o curso existe
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Verificar se o usuário já avaliou este curso
    const existingRating = ratings.find(r => r.courseId === courseId && r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ error: 'Você já avaliou este curso' });
    }

    const newRating = {
      id: generateId(),
      courseId,
      userId,
      rating: parseInt(rating),
      review: review || '',
      createdAt: new Date().toISOString()
    };

    ratings.push(newRating);
    updateCourseRating(courseId);

    res.status(201).json({
      message: 'Avaliação criada com sucesso',
      rating: newRating
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/ratings/:id - Atualizar avaliação (dono ou admin)
router.put('/:id', authenticateToken, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Comentário muito longo')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ratingId = req.params.id;
    const ratingIndex = ratings.findIndex(r => r.id === ratingId);
    
    if (ratingIndex === -1) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    const rating = ratings[ratingIndex];

    // Verificar permissão
    if (req.user.role !== 'admin' && rating.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode editar suas próprias avaliações.' });
    }

    const { rating: newRating, review } = req.body;

    // Atualizar campos
    if (newRating !== undefined) ratings[ratingIndex].rating = parseInt(newRating);
    if (review !== undefined) ratings[ratingIndex].review = review;
    ratings[ratingIndex].updatedAt = new Date().toISOString();

    updateCourseRating(rating.courseId);

    res.json({
      message: 'Avaliação atualizada com sucesso',
      rating: ratings[ratingIndex]
    });
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/ratings/:id - Deletar avaliação (dono ou admin)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const ratingId = req.params.id;
    const ratingIndex = ratings.findIndex(r => r.id === ratingId);
    
    if (ratingIndex === -1) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    const rating = ratings[ratingIndex];

    // Verificar permissão
    if (req.user.role !== 'admin' && rating.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode excluir suas próprias avaliações.' });
    }

    const courseId = rating.courseId;
    
    // Remover avaliação
    ratings.splice(ratingIndex, 1);
    updateCourseRating(courseId);

    res.json({ message: 'Avaliação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/ratings/course/:courseId - Obter avaliações de um curso específico (público)
router.get('/course/:courseId', optionalAuth, (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const courseRatings = ratings.filter(rating => rating.courseId === courseId);
    
    // Ordenar por data (mais recentes primeiro)
    courseRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRatings = courseRatings.slice(startIndex, endIndex);

    res.json({
      ratings: paginatedRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(courseRatings.length / limit),
        totalRatings: courseRatings.length,
        hasNextPage: endIndex < courseRatings.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Erro ao obter avaliações do curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/ratings/user/:userId - Obter avaliações de um usuário específico (público)
router.get('/user/:userId', optionalAuth, (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const userRatings = ratings.filter(rating => rating.userId === userId);
    
    // Ordenar por data (mais recentes primeiro)
    userRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRatings = userRatings.slice(startIndex, endIndex);

    res.json({
      ratings: paginatedRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userRatings.length / limit),
        totalRatings: userRatings.length,
        hasNextPage: endIndex < userRatings.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Erro ao obter avaliações do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
