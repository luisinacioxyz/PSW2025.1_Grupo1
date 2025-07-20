const express = require('express');
const { body, validationResult } = require('express-validator');
const { userLists, courses, generateId } = require('../data/mockData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/lists/my - Obter lista do usuário atual (autenticado)
router.get('/my', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    let userList = userLists.find(list => list.userId === userId);
    
    // Se não existe, criar uma lista vazia
    if (!userList) {
      userList = {
        id: generateId(),
        userId,
        courseIds: [],
        createdAt: new Date().toISOString()
      };
      userLists.push(userList);
    }

    // Buscar detalhes dos cursos
    const coursesInList = courses.filter(course => userList.courseIds.includes(course.id));

    res.json({
      list: userList,
      courses: coursesInList
    });
  } catch (error) {
    console.error('Erro ao obter lista do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/lists/add - Adicionar curso à lista (autenticado)
router.post('/add', authenticateToken, [
  body('courseId').notEmpty().withMessage('ID do curso é obrigatório')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.body;
    const userId = req.user.id;

    // Verificar se o curso existe
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Buscar ou criar lista do usuário
    let userListIndex = userLists.findIndex(list => list.userId === userId);
    if (userListIndex === -1) {
      const newList = {
        id: generateId(),
        userId,
        courseIds: [],
        createdAt: new Date().toISOString()
      };
      userLists.push(newList);
      userListIndex = userLists.length - 1;
    }

    // Verificar se curso já está na lista
    if (userLists[userListIndex].courseIds.includes(courseId)) {
      return res.status(400).json({ error: 'Curso já está na sua lista' });
    }

    // Adicionar curso à lista
    userLists[userListIndex].courseIds.push(courseId);
    userLists[userListIndex].updatedAt = new Date().toISOString();

    res.json({
      message: 'Curso adicionado à lista com sucesso',
      list: userLists[userListIndex]
    });
  } catch (error) {
    console.error('Erro ao adicionar curso à lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/lists/remove/:courseId - Remover curso da lista (autenticado)
router.delete('/remove/:courseId', authenticateToken, (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Buscar lista do usuário
    const userListIndex = userLists.findIndex(list => list.userId === userId);
    if (userListIndex === -1) {
      return res.status(404).json({ error: 'Lista não encontrada' });
    }

    // Verificar se curso está na lista
    const courseIndex = userLists[userListIndex].courseIds.indexOf(courseId);
    if (courseIndex === -1) {
      return res.status(400).json({ error: 'Curso não está na sua lista' });
    }

    // Remover curso da lista
    userLists[userListIndex].courseIds.splice(courseIndex, 1);
    userLists[userListIndex].updatedAt = new Date().toISOString();

    res.json({
      message: 'Curso removido da lista com sucesso',
      list: userLists[userListIndex]
    });
  } catch (error) {
    console.error('Erro ao remover curso da lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/lists/:userId - Obter lista de outro usuário (público)
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userList = userLists.find(list => list.userId === userId);
    
    if (!userList) {
      return res.status(404).json({ error: 'Lista não encontrada' });
    }

    // Buscar detalhes dos cursos
    const coursesInList = courses.filter(course => userList.courseIds.includes(course.id));

    res.json({
      list: userList,
      courses: coursesInList
    });
  } catch (error) {
    console.error('Erro ao obter lista do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
