@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 AI工具箱 Docker 部署脚本
echo ================================
echo.

REM 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

REM 检查Docker Compose是否可用
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Docker Compose 未安装，请先安装 Docker Compose
    pause
    exit /b 1
)

REM 检查环境变量文件是否存在
if not exist ".env.docker.local" (
    echo ⚠️  环境变量文件不存在，正在创建...
    copy ".env.docker" ".env.docker.local" >nul
    echo ✅ 已创建 .env.docker.local 文件
    echo 📝 请编辑 .env.docker.local 文件，配置您的 Dify API 密钥
    echo    主要需要配置：
    echo    - DIFY_CONTRACT_API_KEY=your_contract_api_key
    echo    - DIFY_TRANSLATION_API_KEY=your_translation_api_key
    echo.
    pause
)

echo 🔧 正在构建和启动服务...
docker-compose up --build -d

if errorlevel 1 (
    echo ❌ 服务启动失败，请检查错误信息
    pause
    exit /b 1
)

echo ✅ 服务启动成功！
echo.
echo 🌐 访问地址：
echo    前端应用：http://localhost:80
echo    后端API：http://localhost:8000
echo    API文档：http://localhost:8000/docs
echo.
echo 📊 查看服务状态：docker-compose ps
echo 📋 查看服务日志：docker-compose logs -f
echo 🛑 停止服务：docker-compose down
echo.
pause