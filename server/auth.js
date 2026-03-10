const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Configurações JWT
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_jwt';
const JWT_EXPIRES_IN = '24h';

// Função para registrar um novo usuário
async function registerUser(username, password) {
  try {
    // Verifica se o usuário já existe
    const existingUser = await query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (existingUser.length > 0) {
      throw new Error('Usuário já existe');
    }

    // Criptografa a senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insere o novo usuário no banco de dados
    await query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return { success: true, message: 'Usuário registrado com sucesso' };
  } catch (error) {
    throw error;
  }
}

// Função para autenticar um usuário
async function loginUser(username, password) {
  try {
    // Busca o usuário no banco de dados
    const users = await query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      throw new Error('Credenciais inválidas');
    }

    const user = users[0];
    
    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gera o token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    };
  } catch (error) {
    throw error;
  }
}

// Middleware para verificar o token JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyToken
};