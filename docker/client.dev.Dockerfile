FROM node:22-alpine

WORKDIR /app

COPY bongal-client/package*.json ./

RUN npm install --silent

COPY client/ ./

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
