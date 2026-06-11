FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN chmod -R 755 node_modules/.bin
RUN npm run build