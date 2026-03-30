#!/bin/bash
# 初始化 ollama 模型 - 拉取 bge-m3 用于语义去重

echo "==================================="
echo "初始化 Ollama 模型"
echo "==================================="

docker compose exec -it ollama ollama pull bge-m3

echo ""
echo "==================================="
echo "模型拉取完成！"
echo "==================================="
echo ""
echo "查看已安装的模型："
docker compose exec ollama ollama list
