# WebSSH Pro

Um terminal SSH baseado na web que permite conectar-se a servidores remotos através do navegador de forma segura e interativa.

## 🚀 Funcionalidades

- **Autenticação Segura**: Sistema de login e registro de usuários com JWT
- **Gerenciamento de Servidores**: Cadastro e gerenciamento de múltiplos servidores SSH
- **Terminal Interativo**: Interface de terminal web em tempo real
- **Conexão Segura**: Comunicação criptografada via WebSocket
- **Interface Moderna**: Design responsivo e intuitivo
- **Docker Ready**: Containerização completa com Docker Compose

## 📋 Requisitos

- Node.js 18+
- Docker e Docker Compose
- MySQL 8.0+

## 🛠️ Instalação

### Via Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd webssh-pro
```

2. Inicie os containers:
```bash
docker-compose up -d
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie a aplicação:
```bash
npm start
```

5. Acesse a aplicação:
   - Interface: http://localhost:3000
   - Login: http://localhost:3000/login

### Configuração Manual

1. Configure o banco de dados MySQL
2. Crie o banco de dados `webssh_db`
3. Execute o script `database/init.sql`
4. Configure as variáveis de ambiente no `.env`
5. Siga os passos de instalação acima

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_segura
DB_NAME=webssh_db
JWT_SECRET=sua_chave_secreta_jwt
```

### Docker Compose

O arquivo `docker-compose.yml` configura:

- **webssh**: Aplicação Node.js
- **mysql**: Banco de dados MySQL 8.0
- **Volumes**: Persistência de dados
- **Rede**: Comunicação entre containers

## 📁 Estrutura do Projeto

```
webssh-pro/
├── docker-compose.yml          # Orquestração Docker
├── Dockerfile                  # Container Node.js
├── package.json                # Dependências
├── config/
│   └── db.js                   # Configuração do banco
├── server/
│   ├── server.js               # Servidor principal
│   ├── auth.js                 # Autenticação JWT
│   ├── ssh.js                  # Conexão SSH
│   └── websocket.js            # Comunicação WebSocket
├── routes/
│   ├── login.js                # Rotas de autenticação
│   └── servers.js              # Rotas de servidores
├── database/
│   └── init.sql                # Script de banco
└── public/
    ├── index.html              # Interface principal
    ├── login.html              # Página de login
    ├── app.js                  # Lógica frontend
    └── terminal.js             # Terminal SSH
```

## 🎯 Uso

### Primeiro Acesso

1. Acesse http://localhost:3000/login
2. Registre um novo usuário
3. Faça login com suas credenciais

### Adicionando Servidores

1. No dashboard, clique em "Adicionar Servidor"
2. Preencha os dados do servidor SSH:
   - Nome: Identificador do servidor
   - Host: Endereço IP ou hostname
   - Porta: Porta SSH (padrão: 22)
   - Usuário: Nome de usuário SSH
   - Senha: Senha do usuário SSH
3. Salve o servidor

### Conectando ao Terminal

1. Selecione um servidor na lista
2. Clique em "Conectar"
3. O terminal será aberto em modo interativo
4. Digite comandos normalmente
5. Use as teclas de seta para navegar no histórico

## 🔒 Segurança

- **Autenticação JWT**: Tokens com expiração de 24h
- **Criptografia de Senhas**: bcrypt com salt rounds
- **Validação de Entrada**: Sanitização de dados
- **Conexão Segura**: WebSocket seguro
- **Isolamento**: Containers Docker

## 🐳 Docker

### Comandos Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs da aplicação
docker-compose logs -f webssh

# Acessar o banco de dados
docker-compose exec mysql mysql -u root -p

# Rebuild da aplicação
docker-compose build --no-cache
```

### Personalização

Para modificar a configuração:

1. Edite `docker-compose.yml` conforme necessidade
2. Atualize `Dockerfile` para mudanças no container
3. Rebuild: `docker-compose up -d --build`

## 🚨 Considerações de Segurança

- **Nunca use senhas padrão** em ambiente de produção
- **Utilize HTTPS** em produção
- **Restrinja acesso** ao banco de dados
- **Monitore logs** regularmente
- **Atualize dependências** periodicamente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nome-feature`
3. Faça commit: `git commit -m 'Adiciona feature X'`
4. Push: `git push origin feature/nome-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Biblioteca `ssh2` para conexões SSH
- `Socket.IO` para comunicação em tempo real
- `Express.js` para o framework web
- Comunidade open source

## 📞 Suporte

Para suporte ou dúvidas:

- Abra uma Issue no GitHub
- Consulte a documentação
- Verifique os logs da aplicação

---

**WebSSH Pro** - Conexão SSH segura através do navegador! 🌐🔒