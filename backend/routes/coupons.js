const express = require('express');
const { body, validationResult } = require('express-validator');
const { coupons, courses, generateId } = require('../data/mockData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validações
const couponValidation = [
  body('courseId').notEmpty().withMessage('ID do curso é obrigatório'),
  body('code').trim().isLength({ min: 3, max: 20 }).withMessage('Código deve ter entre 3 e 20 caracteres'),
  body('discount').isFloat({ min: 1, max: 100 }).withMessage('Desconto deve ser entre 1 e 100%'),
  body('expiresAt').isISO8601().withMessage('Data de expiração inválida')
];

// GET /api/coupons/my - Obter cupons do usuário atual (autenticado)
router.get('/my', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userCoupons = coupons.filter(coupon => coupon.userId === userId);
    
    // Adicionar detalhes do curso
    const couponsWithCourses = userCoupons.map(coupon => {
      const course = courses.find(c => c.id === coupon.courseId);
      return {
        ...coupon,
        course: course || null
      };
    });

    res.json({
      coupons: couponsWithCourses,
      total: couponsWithCourses.length
    });
  } catch (error) {
    console.error('Erro ao obter cupons do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/coupons - Criar novo cupom (autenticado)
router.post('/', authenticateToken, couponValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, code, discount, expiresAt } = req.body;
    const userId = req.user.id;

    // Verificar se o curso existe
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Verificar se o código já existe
    const existingCoupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (existingCoupon) {
      return res.status(400).json({ error: 'Código de cupom já existe' });
    }

    // Verificar se a data de expiração é no futuro
    if (new Date(expiresAt) <= new Date()) {
      return res.status(400).json({ error: 'Data de expiração deve ser no futuro' });
    }

    const newCoupon = {
      id: generateId(),
      userId,
      courseId,
      code: code.toUpperCase(),
      discount: parseFloat(discount),
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    coupons.push(newCoupon);

    res.status(201).json({
      message: 'Cupom criado com sucesso',
      coupon: newCoupon
    });
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/coupons/validate/:code - Validar cupom (público)
router.get('/validate/:code', (req, res) => {
  try {
    const { code } = req.params;
    const coupon = coupons.find(c => 
      c.code.toLowerCase() === code.toLowerCase() && 
      !c.isUsed && 
      new Date(c.expiresAt) > new Date()
    );
    
    if (!coupon) {
      return res.status(404).json({ 
        error: 'Cupom inválido, expirado ou já utilizado',
        valid: false
      });
    }

    // Buscar detalhes do curso
    const course = courses.find(c => c.id === coupon.courseId);

    res.json({
      valid: true,
      coupon: {
        ...coupon,
        course: course || null
      }
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/coupons/use/:code - Usar cupom (autenticado)
router.post('/use/:code', authenticateToken, (req, res) => {
  try {
    const { code } = req.params;
    const couponIndex = coupons.findIndex(c => 
      c.code.toLowerCase() === code.toLowerCase() && 
      !c.isUsed && 
      new Date(c.expiresAt) > new Date()
    );
    
    if (couponIndex === -1) {
      return res.status(404).json({ 
        error: 'Cupom inválido, expirado ou já utilizado'
      });
    }

    // Marcar cupom como usado
    coupons[couponIndex].isUsed = true;
    coupons[couponIndex].usedBy = req.user.id;
    coupons[couponIndex].usedAt = new Date().toISOString();

    // Buscar detalhes do curso
    const course = courses.find(c => c.id === coupons[couponIndex].courseId);

    res.json({
      message: 'Cupom utilizado com sucesso',
      coupon: {
        ...coupons[couponIndex],
        course: course || null
      }
    });
  } catch (error) {
    console.error('Erro ao usar cupom:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/coupons/:id - Deletar cupom (dono apenas)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const couponId = req.params.id;
    const couponIndex = coupons.findIndex(c => c.id === couponId);
    
    if (couponIndex === -1) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    const coupon = coupons[couponIndex];

    // Verificar permissão
    if (coupon.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Você só pode excluir seus próprios cupons.' });
    }

    // Remover cupom
    coupons.splice(couponIndex, 1);

    res.json({ message: 'Cupom excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cupom:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
