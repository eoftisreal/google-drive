FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install OpenSSL (required by Prisma to detect libssl version at generate time)
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Install turbo
RUN npm install -g turbo

# Copy workspace package.json files (cache layer)
COPY package.json package-lock.json turbo.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies (cached until package.json changes)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN cd packages/database && npx prisma generate

# Build the apps using turbo
RUN npm run build

# ============================================================================
# Production Stage
# ============================================================================

FROM node:20-slim

# Install OpenSSL (required by Prisma to detect libssl version and load the
# correct query engine binary)
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY apps/api/package.json ./apps/api/

# Copy .env if exists (optional, can be injected at runtime)
COPY apps/api/.env* ./apps/api/

# Expose port
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the API
WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
