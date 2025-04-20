# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Add pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Set npm mirror for faster dependency installation
ENV PNPM_REGISTRY=https://registry.npmmirror.com

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy project files
COPY . .

# Build the project
RUN pnpm build

# Stage 2: Create production image
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom nginx configuration for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 