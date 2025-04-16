# AIDoor

## GitHub CI/CD 配置

本项目使用 GitHub Actions 进行持续集成和部署。需要在 GitHub 仓库中配置以下变量：

### 配置位置
在 GitHub 仓库中，前往 **Settings → Secrets and variables → Actions**，添加以下配置：

### 敏感信息 (Secrets)

| 名称              | 描述               | 用途                 |
| ----------------- | ------------------ | -------------------- |
| `SSH_PRIVATE_KEY` | SSH 私钥           | 用于连接部署服务器   |
| `ALIYUN_PASSWORD` | 阿里云容器仓库密码 | 用于推送 Docker 镜像 |

### 环境变量 (Variables)

| 名称               | 描述               | 用途                     |
| ------------------ | ------------------ | ------------------------ |
| `SSH_HOST`         | 服务器地址         | 部署目标服务器           |
| `SSH_USER`         | 服务器用户名       | 部署目标服务器用户       |
| `DEPLOY_PATH`      | 前端部署路径       | 前端文件部署目录         |
| `ALIYUN_REGISTRY`  | 阿里云容器仓库地址 | 后端 Docker 镜像仓库     |
| `ALIYUN_USERNAME`  | 阿里云用户名       | 后端 Docker 镜像仓库用户 |
| `ALIYUN_NAMESPACE` | 阿里云命名空间     | 后端 Docker 镜像命名空间 |

### 部署要求

1. **前端部署**：
   - 需要目标服务器支持 SSH 连接
   - 需要部署目录有写入权限

2. **后端部署**：
   - 需要目标服务器已配置好 kubectl
   - 需要服务器用户有执行 kubectl 命令的权限