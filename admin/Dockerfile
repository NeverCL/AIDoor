FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm && pnpm build

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