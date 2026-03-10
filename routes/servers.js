const express = require('express');
const { verifyToken } = require('../server/auth');
const { query } = require('../config/db');

const router = express.Router();

// Middleware para proteger as rotas
router.use(verifyToken);

// Rota para listar servidores do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const servers = await query(
      'SELECT id, name, host, port, username, created_at FROM servers WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      servers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar servidores',
      error: error.message
    });
  }
});

// Rota para adicionar um novo servidor
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, host, port, username, password } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !host || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: name, host, username, password'
      });
    }

    // Validação da porta
    const portNum = port ? parseInt(port) : 22;
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return res.status(400).json({
        success: false,
        message: 'Porta inválida'
      });
    }

    // Insere o novo servidor no banco de dados
    const result = await query(
      'INSERT INTO servers (user_id, name, host, port, username, password) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, host, portNum, username, password]
    );

    res.status(201).json({
      success: true,
      message: 'Servidor adicionado com sucesso',
      serverId: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar servidor',
      error: error.message
    });
  }
});

// Rota para atualizar um servidor
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const serverId = req.params.id;
    const { name, host, port, username, password } = req.body;

    // Verifica se o servidor pertence ao usuário
    const serverCheck = await query(
      'SELECT * FROM servers WHERE id = ? AND user_id = ?',
      [serverId, userId]
    );

    if (serverCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Servidor não encontrado ou não pertence ao usuário'
      });
    }

    // Validação da porta
    const portNum = port ? parseInt(port) : 22;
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return res.status(400).json({
        success: false,
        message: 'Porta inválida'
      });
    }

    // Atualiza o servidor
    await query(
      'UPDATE servers SET name = ?, host = ?, port = ?, username = ?, password = ? WHERE id = ?',
      [name, host, portNum, username, password, serverId]
    );

    res.json({
      success: true,
      message: 'Servidor atualizado com sucesso'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar servidor',
      error: error.message
    });
  }
});

// Rota para excluir um servidor
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const serverId = req.params.id;

    // Verifica se o servidor pertence ao usuário
    const serverCheck = await query(
      'SELECT * FROM servers WHERE id = ? AND user_id = ?',
      [serverId, userId]
    );

    if (serverCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Servidor não encontrado ou não pertence ao usuário'
      });
    }

    // Exclui o servidor
    await query(
      'DELETE FROM servers WHERE id = ?',
      [serverId]
    );

    res.json({
      success: true,
      message: 'Servidor excluído com sucesso'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir servidor',
      error: error.message
    });
  }
});

// Rota para obter detalhes de um servidor específico
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const serverId = req.params.id;

    const server = await query(
      'SELECT id, name, host, port, username, created_at FROM servers WHERE id = ? AND user_id = ?',
      [serverId, userId]
    );

    if (server.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Servidor não encontrado'
      });
    }

    res.json({
      success: true,
      server: server[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar servidor',
      error: error.message
    });
  }
});

module.exports = router;