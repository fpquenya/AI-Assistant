#!/bin/bash
# Docker 启动脚本 - AI工具箱项目
# 使用方法: ./docker-start.sh [命令]
# 可用命令: build, up, down, restart, logs, clean

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# 颜色输出函数
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查Docker是否运行
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_color $RED "❌ Docker未运行或未安装，请先启动Docker"
        exit 1
    fi
}

# 检查必要文件
check_required_files() {
    local required_files=(
        "docker-compose.yml"
        "Dockerfile.frontend"
        "Dockerfile.backend"
        ".env.docker"
        "nginx.conf"
    )
    
    local missing_files=()
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        print_color $RED "❌ 缺少必要文件:"
        for file in "${missing_files[@]}"; do
            print_color $RED "   - $file"
        done
        exit 1
    fi
}

# 构建镜像
build_images() {
    print_color $YELLOW "🔨 构建Docker镜像..."
    docker-compose --env-file .env.docker build --no-cache
    print_color $GREEN "✅ 镜像构建成功"
}

# 启动服务
start_services() {
    print_color $YELLOW "🚀 启动AI工具箱服务..."
    docker-compose --env-file .env.docker up -d
    print_color $GREEN "✅ 服务启动成功"
    print_color $CYAN "📱 前端访问地址: http://localhost:3000"
    print_color $CYAN "🔧 后端API地址: http://localhost:8000"
    print_color $CYAN "📊 查看日志: ./docker-start.sh logs"
}

# 停止服务
stop_services() {
    print_color $YELLOW "🛑 停止AI工具箱服务..."
    docker-compose --env-file .env.docker down
    print_color $GREEN "✅ 服务已停止"
}

# 重启服务
restart_services() {
    print_color $YELLOW "🔄 重启AI工具箱服务..."
    stop_services
    start_services
}

# 查看日志
show_logs() {
    print_color $YELLOW "📋 显示服务日志..."
    docker-compose --env-file .env.docker logs -f
}

# 清理资源
clean_resources() {
    print_color $YELLOW "🧹 清理Docker资源..."
    
    # 停止并删除容器
    docker-compose --env-file .env.docker down -v --remove-orphans
    
    # 删除镜像
    local images=$(docker images --filter "reference=ai-toolbox*" -q)
    if [[ -n "$images" ]]; then
        docker rmi $images -f
    fi
    
    # 清理未使用的资源
    docker system prune -f
    
    print_color $GREEN "✅ 清理完成"
}

# 显示帮助信息
show_help() {
    print_color $CYAN "🐳 AI工具箱 Docker 管理脚本"
    echo
    print_color $WHITE "使用方法:"
    print_color $GRAY "  ./docker-start.sh [命令]"
    echo
    print_color $WHITE "可用命令:"
    print_color $GRAY "  build    - 构建Docker镜像"
    print_color $GRAY "  up       - 启动服务 (默认)"
    print_color $GRAY "  down     - 停止服务"
    print_color $GRAY "  restart  - 重启服务"
    print_color $GRAY "  logs     - 查看日志"
    print_color $GRAY "  clean    - 清理所有资源"
    print_color $GRAY "  help     - 显示帮助信息"
    echo
    print_color $WHITE "示例:"
    print_color $GRAY "  ./docker-start.sh build    # 构建镜像"
    print_color $GRAY "  ./docker-start.sh up       # 启动服务"
    print_color $GRAY "  ./docker-start.sh logs     # 查看日志"
}

# 主逻辑
print_color $CYAN "🐳 AI工具箱 Docker 管理器"
print_color $CYAN "========================="

# 检查Docker状态
check_docker

# 检查必要文件
check_required_files

# 获取命令参数
COMMAND=${1:-"up"}

# 执行命令
case "$COMMAND" in
    "build")
        build_images
        ;;
    "up")
        start_services
        ;;
    "down")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        clean_resources
        ;;
    "help")
        show_help
        ;;
    *)
        print_color $RED "❌ 未知命令: $COMMAND"
        print_color $YELLOW "使用 './docker-start.sh help' 查看可用命令"
        exit 1
        ;;
esac