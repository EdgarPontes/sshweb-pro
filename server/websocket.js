const { SSHConnection, validateSSHConfig } = require('./ssh');

// Armazena as conexões SSH ativas
const activeConnections = new Map();

function setupWebSocket(io) {
  io.on('connection', (socket) => {
    console.log('Cliente WebSocket conectado:', socket.id);

    // Evento para conectar a um servidor SSH
    socket.on('ssh_connect', async (data) => {
      try {
        // Valida os dados de conexão
        validateSSHConfig(data);

        // Cria uma nova conexão SSH
        const sshConnection = new SSHConnection();
        
        sshConnection.connect(data, (err) => {
          if (err) {
            socket.emit('ssh_error', { message: err.message });
            return;
          }

          // Armazena a conexão ativa
          activeConnections.set(socket.id, sshConnection);

          // Cria o shell interativo
          sshConnection.createShell((err, stream) => {
            if (err) {
              socket.emit('ssh_error', { message: err.message });
              return;
            }

            socket.emit('ssh_connected', { message: 'Conexão SSH estabelecida' });

            // Manipula dados recebidos do cliente
            socket.on('ssh_input', (input) => {
              if (stream && sshConnection.connected) {
                stream.write(input);
              }
            });

            // Manipula dados recebidos do servidor SSH
            stream.on('data', (data) => {
              socket.emit('ssh_output', { data: data.toString() });
            });

            // Manipula erro do shell
            stream.on('error', (err) => {
              socket.emit('ssh_error', { message: err.message });
            });

            // Manipula fechamento do shell
            stream.on('close', () => {
              socket.emit('ssh_close', { message: 'Conexão SSH encerrada' });
              cleanupConnection(socket.id);
            });
          });
        });

      } catch (error) {
        socket.emit('ssh_error', { message: error.message });
      }
    });

    // Evento para executar comandos SSH
    socket.on('ssh_exec', async (data) => {
      const sshConnection = activeConnections.get(socket.id);
      
      if (!sshConnection || !sshConnection.connected) {
        socket.emit('ssh_error', { message: 'Conexão SSH não estabelecida' });
        return;
      }

      try {
        sshConnection.exec(data.command, (err, output) => {
          if (err) {
            socket.emit('ssh_error', { message: err.message });
          } else {
            socket.emit('ssh_output', { data: output });
          }
        });
      } catch (error) {
        socket.emit('ssh_error', { message: error.message });
      }
    });

    // Evento para desconectar do servidor SSH
    socket.on('ssh_disconnect', () => {
      cleanupConnection(socket.id);
      socket.emit('ssh_disconnected', { message: 'Desconectado do servidor SSH' });
    });

    // Evento quando o cliente se desconecta
    socket.on('disconnect', () => {
      console.log('Cliente WebSocket desconectado:', socket.id);
      cleanupConnection(socket.id);
    });
  });

  // Função para limpar conexões ativas
  function cleanupConnection(socketId) {
    const sshConnection = activeConnections.get(socketId);
    
    if (sshConnection) {
      sshConnection.disconnect();
      activeConnections.delete(socketId);
    }
  }
}

module.exports = setupWebSocket;