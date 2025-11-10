FROM node:22-alpine AS builder

WORKDIR /app

COPY bongal-client/package*.json ./

RUN npm ci --silent

COPY bongal-client/ ./

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache curl

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html


RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
