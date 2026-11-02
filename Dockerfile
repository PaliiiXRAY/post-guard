# Production Dockerfile for PostGuard MERN Platform
FROM node:20-alpine

LABEL maintainer="Pallabi Pandi <pallabitheprincess74@gmail.com>"
LABEL project="PostGuard - Enterprise Post-Quantum Cryptographic Scanner & Migration Engine"

WORKDIR /app

# Install dependencies with production caching
COPY package*.json ./
RUN npm install --only=production

# Copy application source tree
COPY . .

# Expose HTTP port
EXPOSE 5001

# Healthcheck probe (Session 29)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start Node.js production server
CMD ["node", "server/server.js"]
