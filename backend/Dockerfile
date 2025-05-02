FROM node:18.20.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 6005
CMD ["npm", "start"]

