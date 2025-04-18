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

| 名称          | 描述         | 用途             |
| ------------- | ------------ | ---------------- |
| `DEPLOY_PATH` | 前端部署路径 | 前端文件部署目录 |

### 硬编码配置

以下配置已经在 CI/CD 工作流中直接硬编码：

| 配置项                 | 值                               |
| ---------------------- | -------------------------------- |
| 服务器地址             | app.thedoorofai.com              |
| 服务器用户名           | root                             |
| 阿里云容器仓库地址     | registry.cn-beijing.aliyuncs.com |
| 阿里云用户名           | gmmtec                           |
| 阿里云 Docker 镜像路径 | wdora/ai-api                     |

### 部署要求

1. **前端部署**：
   - 需要目标服务器支持 SSH 连接
   - 需要部署目录有写入权限

2. **后端部署**：
   - 需要目标服务器已配置好 kubectl
   - 需要服务器用户有执行 kubectl 命令的权限