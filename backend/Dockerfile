# Utiliza una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Instala PM2 globalmente
RUN npm install pm2 -g

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto en el que la aplicación escuchará
EXPOSE 6005

# Define el comando por defecto para ejecutar la aplicación con PM2
CMD ["pm2-runtime", "ecosystem.config.cjs", "--env", "production"]