# ========== Stage 1: Build the React app ==========
FROM node:20-alpine AS build

WORKDIR /app

COPY bongal-client/package*.json ./
COPY bongal-client/yarn.lock ./
RUN npm ci

COPY bongal-client/ .
RUN npm run build


# ========== Stage 2: Serve with NGINX ==========
FROM nginx:1.27-alpine

# Copy custom NGINX config for SPA support
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
