# Kubernetes 部署说明

本目录包含用于将 AIDoor 应用部署到 Kubernetes 集群的配置文件。

## 配置文件说明

- `deployment.yaml`: 定义了应用的部署配置，包括副本数、容器镜像、资源限制和健康检查
- `service.yaml`: 定义了应用的服务暴露方式以及 Ingress 配置

## 部署方式

### GitHub Actions 自动部署

项目已配置 GitHub Actions 工作流程，当推送到 `main` 分支时，会自动构建并部署应用到 Kubernetes 集群。
工作流程文件路径: `.github/workflows/app-deploy.yml`

### 手动部署步骤

如果您需要手动部署而不是通过 GitHub Actions，请按照以下步骤操作：

1. 确保您已安装 kubectl 并配置了正确的 kubeconfig

2. 构建并推送 Docker 镜像到阿里云容器服务
   ```bash
   # 登录阿里云容器服务
   docker login registry.cn-beijing.aliyuncs.com --username gmmtec --password YOUR_PASSWORD
   
   # 构建镜像
   docker build -t registry.cn-beijing.aliyuncs.com/wdora/ai-app:latest ./app
   
   # 推送镜像
   docker push registry.cn-beijing.aliyuncs.com/wdora/ai-app:latest
   ```

3. 部署应用
   ```bash
   # 创建命名空间（如果不存在）
   kubectl create namespace aidoor --dry-run=client -o yaml | kubectl apply -f -
   
   # 设置镜像标签
   export IMAGE_TAG=registry.cn-beijing.aliyuncs.com/wdora/ai-app:latest
   
   # 应用 Kubernetes 配置
   envsubst < app/kubernetes/deployment.yaml | kubectl apply -f -
   kubectl apply -f app/kubernetes/service.yaml -n aidoor
   ```

4. 检查部署状态
   ```bash
   kubectl get pods -l app=aidoor-app -n aidoor
   kubectl get svc aidoor-app -n aidoor
   kubectl get ingress aidoor-app-ingress -n aidoor
   ```

## 注意事项

1. 在生产环境中，请根据实际需求调整 `deployment.yaml` 中的资源限制和副本数
2. 应用通过 Ingress 暴露，域名为 `app.aidoor.cn`
3. 项目使用了以下 GitHub 密钥：
   - `ALIYUN_PASSWORD`: 阿里云容器服务的密码，用于推送镜像
   - `KUBE_CONFIG`: Kubernetes 集群的配置文件，用于部署应用 