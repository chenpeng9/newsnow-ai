#!/bin/bash

# Docker 清理脚本
# 清理临时 Docker 文件和容器

echo "正在清理 Docker 临时文件..."

# 删除临时目录
if [ -d "docker-temp-node_modules" ]; then
    rm -rf docker-temp-node_modules
    echo "✅ 已删除 docker-temp-node_modules"
fi

if [ -d "docker-temp-public" ]; then
    rm -rf docker-temp-public
    echo "✅ 已删除 docker-temp-public"
fi

# 停止并删除相关容器
docker compose down -v 2>/dev/null || true
docker stop test-ollama 2>/dev/null || true
docker rm test-ollama 2>/dev/null || true

# 清理无用的镜像
docker image prune -f 2>/dev/null || true

echo "🎉 Docker 清理完成！"