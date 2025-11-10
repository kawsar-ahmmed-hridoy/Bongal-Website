FROM node:22-alpine

WORKDIR /app

COPY bongal-client/package*.json ./

RUN npm install --silent

COPY bongal-client/ ./

EXPOSE 5173

ENV PORT=5173
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
