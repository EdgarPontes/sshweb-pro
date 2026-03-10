const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'senha_segura',
  database: process.env.DB_NAME || 'webssh_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Cria o pool de conexões
const pool = mysql.createPool(dbConfig);

// Testa a conexão com o banco de dados
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    return false;
  }
}

// Função para executar consultas SQL
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  query
};