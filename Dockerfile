# Estágio de construção
FROM node:18 AS build

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o arquivo package.json e package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Instale as dependências de produção do projeto
RUN npm install

# Copie o restante do código da aplicação, incluindo o knexfile.js
COPY . .

# Compile o código TypeScript
RUN npm run build
RUN npm install --omit=dev && npm cache clean --force

# Estágio de produção
FROM node:18-alpine3.19

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie os arquivos necessários do estágio de construção
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/knexfile.js ./knexfile.js
COPY --from=build /usr/src/app/node_modules ./node_modules

# Exponha a porta em que a aplicação será executada
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]