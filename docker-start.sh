#!/bin/bash

# AI工具箱 Docker 快速启动脚本
# 使用方法：./docker-start.sh

echo "🚀 AI工具箱 Docker 部署脚本"
echo "================================"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误：Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查环境变量文件是否存在
if [ ! -f ".env.docker.local" ]; then
    echo "⚠️  环境变量文件不存在，正在创建..."
    cp .env.docker .env.docker.local
    echo "✅ 已创建 .env.docker.local 文件"
    echo "📝 请编辑 .env.docker.local 文件，配置您的 Dify API 密钥"
    echo "   主要需要配置："
    echo "   - DIFY_CONTRACT_API_KEY=your_contract_api_key"
    echo "   - DIFY_TRANSLATION_API_KEY=your_translation_api_key"
    echo ""
    read -p "配置完成后按回车键继续..."
fi

echo "🔧 正在构建和启动服务..."
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo "✅ 服务启动成功！"
    echo ""
    echo "🌐 访问地址："
    echo "   前端应用：http://localhost:80"
    echo "   后端API：http://localhost:8000"
    echo "   API文档：http://localhost:8000/docs"
    echo ""
    echo "📊 查看服务状态：docker-compose ps"
    echo "📋 查看服务日志：docker-compose logs -f"
    echo "🛑 停止服务：docker-compose down"
else
    echo "❌ 服务启动失败，请检查错误信息"
    exit 1
fi