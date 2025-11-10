FROM node:22-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY server/package*.json ./

RUN npm install --silent

COPY server/ ./

EXPOSE 5000

CMD ["npm", "run", "dev"]
