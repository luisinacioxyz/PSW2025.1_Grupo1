const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Estratégia Local para login com email e senha
passport.use(new LocalStrategy({
  usernameField: 'email', // Usar email como campo de username
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Buscar usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Email ou senha incorretos' });
    }

    // Autenticação bem-sucedida
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Estratégia JWT para proteger rotas
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
  try {
    // Buscar usuário pelo ID do payload
    const user = await User.findById(jwtPayload.id).select('-password');
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Usuário não encontrado' });
    }
  } catch (error) {
    return done(error);
  }
}));

// Serialização do usuário (necessária para sessões, mas não usaremos)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport; 