const express = require('express');
const { registerUser, loginUser } = require('../server/auth');

const router = express.Router();

// Rota para registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e password são obrigatórios'
      });
    }

    const result = await registerUser(username, password);
    res.status(201).json(result);

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Rota para login de usuário
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e password são obrigatórios'
      });
    }

    const result = await loginUser(username, password);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }

  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Rota para validar token
router.get('/validate', async (req, res) => {
  // Esta rota será protegida pelo middleware verifyToken
  res.json({
    success: true,
    message: 'Token válido',
    user: req.user
  });
});

module.exports = router;