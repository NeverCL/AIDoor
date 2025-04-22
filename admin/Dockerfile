FROM node:20-alpine AS base

# 安装依赖
FROM base AS builder
WORKDIR /app

# Add pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Set npm mirror for faster dependency installation
ENV PNPM_REGISTRY=https://registry.npmmirror.com

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy project files
COPY . .

# Build the project
RUN pnpm build

# 生产环境
FROM nginx:alpine AS runner
ARG BUILD_VERSION=dev
ENV BUILD_VERSION=${BUILD_VERSION}

# 复制 Nginx 配置
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"] 