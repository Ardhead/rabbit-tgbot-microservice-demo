FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm run migrate:up

COPY . .
RUN npm run build

CMD ["node", "dist/main"]
