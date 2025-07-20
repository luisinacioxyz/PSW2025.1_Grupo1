const express = require('express');
const { body, validationResult } = require('express-validator');
const { courses, generateId } = require('../data/mockData');
const { authenticateToken, optionalAuth, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const courseValidation = [
  body('title').trim().isLength({ min: 3 }).withMessage('Título deve ter pelo menos 3 caracteres'),
  body('platform').notEmpty().withMessage('Plataforma é obrigatória'),
  body('url').isURL().withMessage('URL inválida'),
  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Descrição muito longa'),
  body('imageUrl').optional().isURL().withMessage('URL da imagem inválida')
];

// GET /api/courses - Listar todos os cursos (público)
router.get('/', optionalAuth, (req, res) => {
  try {
    const { search, platform, sortBy, order = 'asc', page = 1, limit = 12 } = req.query;
    
    let filteredCourses = [...courses];

    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por plataforma
    if (platform) {
      filteredCourses = filteredCourses.filter(course => course.platform === platform);
    }

    // Ordenar
    if (sortBy) {
      filteredCourses.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (order === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    res.json({
      courses: paginatedCourses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCourses.length / limit),
        totalCourses: filteredCourses.length,
        hasNextPage: endIndex < filteredCourses.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/courses/:id - Obter curso específico (público)
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const courseId = req.params.id;
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    res.json(course);
  } catch (error) {
    console.error('Erro ao obter curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/courses - Criar novo curso (autenticado)
router.post('/', authenticateToken, courseValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, platform, url, price, description, imageUrl } = req.body;

    const newCourse = {
      id: generateId(),
      title,
      platform,
      url,
      price: parseFloat(price),
      description: description || '',
      imageUrl: imageUrl || 'https://via.placeholder.com/300x200',
      rating: 0,
      totalRatings: 0,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    courses.push(newCourse);

    res.status(201).json({
      message: 'Curso criado com sucesso',
      course: newCourse
    });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/courses/:id - Atualizar curso (dono ou admin)
router.put('/:id', authenticateToken, courseValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const courseId = req.params.id;
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    const course = courses[courseIndex];

    // Verificar permissão
    if (req.user.role !== 'admin' && course.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode editar seus próprios cursos.' });
    }

    const { title, platform, url, price, description, imageUrl } = req.body;

    // Atualizar campos
    courses[courseIndex] = {
      ...course,
      title,
      platform,
      url,
      price: parseFloat(price),
      description: description || course.description,
      imageUrl: imageUrl || course.imageUrl,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Curso atualizado com sucesso',
      course: courses[courseIndex]
    });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/courses/:id - Deletar curso (dono ou admin)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const courseId = req.params.id;
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    const course = courses[courseIndex];

    // Verificar permissão
    if (req.user.role !== 'admin' && course.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode excluir seus próprios cursos.' });
    }

    // Remover curso
    courses.splice(courseIndex, 1);

    res.json({ message: 'Curso excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/courses/platforms/list - Listar plataformas disponíveis (público)
router.get('/platforms/list', (req, res) => {
  try {
    const platforms = [...new Set(courses.map(course => course.platform))];
    res.json({ platforms });
  } catch (error) {
    console.error('Erro ao listar plataformas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/courses/user/:userId - Listar cursos de um usuário específico (público)
router.get('/user/:userId', optionalAuth, (req, res) => {
  try {
    const { userId } = req.params;
    const userCourses = courses.filter(course => course.createdBy === userId);
    
    res.json({
      courses: userCourses,
      total: userCourses.length
    });
  } catch (error) {
    console.error('Erro ao listar cursos do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
