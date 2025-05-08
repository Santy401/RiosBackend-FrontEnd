FROM node:18-alpine

# Instalar pnpm de manera más directa
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile --prod

# Copiar el resto del código
COPY . .

ENV NODE_ENV=production
ENV PORT=6005

EXPOSE 6005

CMD ["pnpm", "start"]

