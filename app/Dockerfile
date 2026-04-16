# Build stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# Final stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Change ownership
RUN chown -R appuser:appgroup /usr/src/app

USER appuser

EXPOSE 3000

CMD ["npm", "start"]
