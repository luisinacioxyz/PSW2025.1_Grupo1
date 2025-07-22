const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body; // Adicione 'role' aqui
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Usuário já existe com este email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'user' }); // Use o papel fornecido ou 'user' como padrão
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    const { password: _, ...data } = user.toObject();
    res.status(201).json({ message: 'Usuário criado com sucesso', token, user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Método chamado após autenticação bem-sucedida pelo Passport
exports.loginSuccess = (req, res) => {
  try {
    // req.user foi populado pelo Passport após autenticação bem-sucedida
    const user = req.user;
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    const { password: _, ...data } = user.toObject();
    res.json({ 
      message: 'Login realizado com sucesso', 
      token, 
      user: data 
    });
  } catch (err) {
    console.error('Erro ao gerar token:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Manter o método original como backup (será removido depois)
exports.login = async (req, res) => {
    
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  console.log("Tentativa de login com:", { email, password });
  try {
    const user = await User.findOne({ email });
    console.log("Usuário encontrado:", user ? user.email : "Nenhum usuário encontrado");
    if (!user) return res.status(401).json({ error: 'Email ou senha incorretos' });

    const match = await bcrypt.compare(password, user.password);
    console.log("Resultado da comparação:", match); // Adicione aqui
    console.log("Senha fornecida:", password);
    console.log("Hash armazenado:", user.password);
    if (!match) return res.status(401).json({ error: 'Email ou senha incorretos' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    const { password: _, ...data } = user.toObject();
    res.json({ message: 'Login realizado com sucesso', token, user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.me = (req, res) => {
  // req.user já foi populado no middleware
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (email && email !== user.email && await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    if (name)  user.name  = name;
    if (email) user.email = email;
    await user.save();

    const { password: _, ...data } = user.toObject();
    res.json({ message: 'Perfil atualizado com sucesso', user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ error: 'Senha atual incorreta' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
