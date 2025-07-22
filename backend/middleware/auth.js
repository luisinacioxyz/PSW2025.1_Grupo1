const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// Novo middleware usando Passport JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware para verificar token JWT (versão original - mantida como backup)
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Buscar usuário completo no MongoDB
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

// Middleware opcional de autenticação (não falha se não houver token)
async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

// Middleware para verificar se é admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Privilégios de administrador necessários.' });
  }
  next();
}

// Middleware para verificar se é dono do recurso ou admin
// paramKey: nome do parâmetro na rota que contém o userId
function requireOwnershipOrAdmin(paramKey = 'userId') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação requerida' });
    }
    const resourceUserId = req.params[paramKey];
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      return next();
    }
    return res.status(403).json({ error: 'Acesso negado. Você só pode acessar seus próprios recursos.' });
  };
}

module.exports = {
  authenticateJWT,        // Novo middleware usando Passport
  authenticateToken,      // Middleware original (backup)
  optionalAuth,
  requireAdmin,
  requireOwnershipOrAdmin
};