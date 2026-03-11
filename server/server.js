const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('../config/db');

// Importa os módulos
const authRoutes = require('../routes/login');
const serverRoutes = require('../routes/servers');

// Configuração do app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configurações middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Configuração do WebSocket
require('./websocket')(io);

// Inicializa o servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Iniciando servidor WebSSH Pro...');
    console.log(`Configuração do banco: ${process.env.DB_HOST}:${process.env.DB_USER}@${process.env.DB_NAME}`);
    
    // Testa conexão com o banco de dados
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      server.listen(PORT, () => {
        console.log(`✅ Servidor rodando na porta ${PORT}`);
        console.log(`🌐 Acesse: http://localhost:${PORT}`);
        console.log(`🔗 Login: http://localhost:${PORT}/login`);
      });
    } else {
      console.log('❌ Não foi possível conectar ao banco de dados. O servidor não será iniciado.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();