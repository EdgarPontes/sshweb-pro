const { Pool } = require('pg');
require('dotenv').config();

// Configuração da conexão com o banco de dados PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'senha_segura',
  database: process.env.DB_NAME || 'webssh_db',
  port: process.env.DB_PORT || 5432,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Cria o pool de conexões
const pool = new Pool(dbConfig);

// Testa a conexão com o banco de dados com retry
async function testConnection(maxRetries = 5, retryDelay = 2000) {
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const client = await pool.connect();
      console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
      client.release();
      return true;
    } catch (error) {
      attempts++;
      console.error(`Tentativa ${attempts}/${maxRetries} falhou ao conectar ao banco de dados:`, error.message);
      
      if (attempts >= maxRetries) {
        console.error('Número máximo de tentativas atingido. Não foi possível conectar ao banco de dados.');
        return false;
      }
      
      console.log(`Aguardando ${retryDelay/1000} segundos antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

// Função para executar consultas SQL
async function query(text, params = []) {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error.message);
    throw error;
  }
}

// Função para executar consultas que não retornam linhas (INSERT, UPDATE, DELETE)
async function execute(text, params = []) {
  try {
    const result = await pool.query(text, params);
    return result.rowCount;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  query,
  execute
};