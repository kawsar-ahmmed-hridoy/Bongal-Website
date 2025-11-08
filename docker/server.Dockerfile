# ========== Stage 1: Build the server ==========
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy package and lock files
COPY bongal-server/package*.json ./
COPY bongal-server/tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY bongal-server/ .

# Build TypeScript
RUN npm run build


# ========== Stage 2: Run the server ==========
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy environment file if needed (optional)
# COPY bongal-server/.env .env

# Expose API port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]
