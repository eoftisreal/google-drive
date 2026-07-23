FROM node:20-alpine AS builder
# Set working directory
WORKDIR /app

# Install turbo
RUN npm install -g turbo

# Copy workspace package.json files
COPY package.json package-lock.json turbo.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN cd packages/database && npx prisma generate

# Build the apps using turbo
RUN npm run build

# Start the apps
# We can use a lightweight process manager or just start the API since this is a typical setup
# For this scaffold, let's start the API as the primary entry point (or provide a script)
CMD ["npm", "run", "start:prod", "-w", "api"]
