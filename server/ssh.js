const { Client } = require('ssh2');

class SSHConnection {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  // Conecta a um servidor SSH
  connect(config, callback) {
    this.client = new Client();
    
    this.client.on('ready', () => {
      console.log('Conexão SSH estabelecida');
      this.connected = true;
      callback(null, 'Conexão estabelecida');
    });

    this.client.on('error', (err) => {
      console.error('Erro na conexão SSH:', err.message);
      this.connected = false;
      callback(err);
    });

    this.client.on('close', () => {
      console.log('Conexão SSH fechada');
      this.connected = false;
    });

    this.client.connect({
      host: config.host,
      port: config.port || 22,
      username: config.username,
      password: config.password,
      readyTimeout: 20000
    });
  }

  // Executa um comando no servidor SSH
  exec(command, callback) {
    if (!this.connected || !this.client) {
      return callback(new Error('Conexão SSH não estabelecida'));
    }

    this.client.exec(command, (err, stream) => {
      if (err) {
        return callback(err);
      }

      let output = '';
      let errorOutput = '';

      stream.on('data', (data) => {
        output += data.toString();
      });

      stream.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      stream.on('close', (code, signal) => {
        if (errorOutput) {
          callback(new Error(errorOutput));
        } else {
          callback(null, output);
        }
      });
    });
  }

  // Cria um shell interativo
  createShell(callback) {
    if (!this.connected || !this.client) {
      return callback(new Error('Conexão SSH não estabelecida'));
    }

    this.client.shell((err, stream) => {
      if (err) {
        return callback(err);
      }

      callback(null, stream);
    });
  }

  // Fecha a conexão SSH
  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    this.connected = false;
  }
}

// Função para validar configuração SSH
function validateSSHConfig(config) {
  const requiredFields = ['host', 'username', 'password'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
  }

  if (config.port && (isNaN(config.port) || config.port < 1 || config.port > 65535)) {
    throw new Error('Porta SSH inválida');
  }

  return true;
}

module.exports = {
  SSHConnection,
  validateSSHConfig
};