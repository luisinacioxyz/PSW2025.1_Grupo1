const jwt = require('jsonwebtoken');
const { users } = require('../data/mockData');

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    
    // Buscar usuário completo pelos dados do token
    const fullUser = users.find(u => u.id === user.id);
    if (!fullUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    req.user = fullUser;
    next();
  });
};

// Middleware opcional de autenticação (não falha se não houver token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      const fullUser = users.find(u => u.id === user.id);
      req.user = fullUser || null;
    }
    next();
  });
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Privilégios de administrador necessários.' });
  }
  next();
};

// Middleware para verificar se é dono do recurso ou admin
const requireOwnershipOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação requerida' });
    }
    
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      return next();
    }
    
    return res.status(403).json({ error: 'Acesso negado. Você só pode acessar seus próprios recursos.' });
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireOwnershipOrAdmin
};
