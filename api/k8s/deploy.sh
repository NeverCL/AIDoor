#!/bin/bash
set -e

# 配置变量
IMAGE_NAME="aidoor-webapi"
REGISTRY="${REGISTRY:-localhost:5000}"
TAG="${TAG:-latest}"
NAMESPACE="aidoor"

# 确保命名空间存在
kubectl get namespace $NAMESPACE > /dev/null 2>&1 || kubectl create namespace $NAMESPACE

# 检查认证密钥是否已存在
if ! kubectl get secret aidoor-auth-keys -n $NAMESPACE > /dev/null 2>&1; then
    echo "生成新的数据保护密钥..."
    DATA_PROTECTION_KEY=$(openssl rand -base64 32)
    
    kubectl create secret generic aidoor-auth-keys \
        --namespace=$NAMESPACE \
        --from-literal=dataProtectionKey="$DATA_PROTECTION_KEY"
    echo "数据保护密钥已创建。"
else
    echo "使用现有数据保护密钥。"
fi

echo "Building Docker image..."
docker build -t $REGISTRY/$IMAGE_NAME:$TAG -f AIDoor.WebAPI/Dockerfile .

echo "Pushing Docker image to registry..."
docker push $REGISTRY/$IMAGE_NAME:$TAG

echo "Applying Kubernetes manifests..."
# 使用环境变量替换占位符
envsubst < k8s/aidoor-webapi.yaml | kubectl apply -f -

echo "Deployment completed successfully!"
echo "API will be available at: https://api.aidoor.example.com" 