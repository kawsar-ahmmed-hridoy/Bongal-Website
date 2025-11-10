FROM node:22-alpine AS builder

WORKDIR /app

COPY bongal-server/package*.json ./

RUN npm ci --silent

COPY bongal-server/ ./

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

COPY server/package*.json ./

RUN npm ci --only=production --silent && \
    npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

RUN mkdir -p uploads logs && \
    chown -R nodejs:nodejs uploads logs && \
    chmod -R 755 uploads logs

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/server.js"]
