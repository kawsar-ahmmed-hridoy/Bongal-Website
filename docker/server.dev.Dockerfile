FROM node:22-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY bongal-server/package*.json ./

RUN npm install --silent

COPY bongal-server/ ./

EXPOSE 5000

ENV NODE_ENV=development
ENV PORT=5000

CMD ["nodemon", "--watch", "src", "--ext", "ts,js", "src/server.ts"]
