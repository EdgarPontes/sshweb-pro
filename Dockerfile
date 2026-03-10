# Usa a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Expõe a porta que a aplicação irá escutar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]