#!/usr/bin/env pwsh
# Docker 启动脚本 - AI工具箱项目
# 使用方法: .\docker-start.ps1 [命令]
# 可用命令: build, up, down, restart, logs, clean

param(
    [Parameter(Position=0)]
    [string]$Command = "up"
)

# 颜色输出函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 检查Docker是否运行
function Test-DockerRunning {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-ColorOutput "❌ Docker未运行或未安装，请先启动Docker Desktop" "Red"
        return $false
    }
}

# 检查必要文件
function Test-RequiredFiles {
    $requiredFiles = @(
        "docker-compose.yml",
        "Dockerfile.frontend",
        "Dockerfile.backend",
        ".env.docker",
        "nginx.conf"
    )
    
    $missing = @()
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            $missing += $file
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-ColorOutput "❌ 缺少必要文件:" "Red"
        foreach ($file in $missing) {
            Write-ColorOutput "   - $file" "Red"
        }
        return $false
    }
    return $true
}

# 构建镜像
function Build-Images {
    Write-ColorOutput "🔨 构建Docker镜像..." "Yellow"
    docker-compose --env-file .env.docker build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ 镜像构建成功" "Green"
    } else {
        Write-ColorOutput "❌ 镜像构建失败" "Red"
        exit 1
    }
}

# 启动服务
function Start-Services {
    Write-ColorOutput "🚀 启动AI工具箱服务..." "Yellow"
    docker-compose --env-file .env.docker up -d
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ 服务启动成功" "Green"
        Write-ColorOutput "📱 前端访问地址: http://localhost:3000" "Cyan"
        Write-ColorOutput "🔧 后端API地址: http://localhost:8000" "Cyan"
        Write-ColorOutput "📊 查看日志: .\docker-start.ps1 logs" "Cyan"
    } else {
        Write-ColorOutput "❌ 服务启动失败" "Red"
        exit 1
    }
}

# 停止服务
function Stop-Services {
    Write-ColorOutput "🛑 停止AI工具箱服务..." "Yellow"
    docker-compose --env-file .env.docker down
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ 服务已停止" "Green"
    } else {
        Write-ColorOutput "❌ 服务停止失败" "Red"
    }
}

# 重启服务
function Restart-Services {
    Write-ColorOutput "🔄 重启AI工具箱服务..." "Yellow"
    Stop-Services
    Start-Services
}

# 查看日志
function Show-Logs {
    Write-ColorOutput "📋 显示服务日志..." "Yellow"
    docker-compose --env-file .env.docker logs -f
}

# 清理资源
function Clean-Resources {
    Write-ColorOutput "🧹 清理Docker资源..." "Yellow"
    
    # 停止并删除容器
    docker-compose --env-file .env.docker down -v --remove-orphans
    
    # 删除镜像
    $images = docker images --filter "reference=ai-toolbox*" -q
    if ($images) {
        docker rmi $images -f
    }
    
    # 清理未使用的资源
    docker system prune -f
    
    Write-ColorOutput "✅ 清理完成" "Green"
}

# 显示帮助信息
function Show-Help {
    Write-ColorOutput "🐳 AI工具箱 Docker 管理脚本" "Cyan"
    Write-ColorOutput "" 
    Write-ColorOutput "使用方法:" "White"
    Write-ColorOutput "  .\docker-start.ps1 [命令]" "Gray"
    Write-ColorOutput "" 
    Write-ColorOutput "可用命令:" "White"
    Write-ColorOutput "  build    - 构建Docker镜像" "Gray"
    Write-ColorOutput "  up       - 启动服务 (默认)" "Gray"
    Write-ColorOutput "  down     - 停止服务" "Gray"
    Write-ColorOutput "  restart  - 重启服务" "Gray"
    Write-ColorOutput "  logs     - 查看日志" "Gray"
    Write-ColorOutput "  clean    - 清理所有资源" "Gray"
    Write-ColorOutput "  help     - 显示帮助信息" "Gray"
    Write-ColorOutput "" 
    Write-ColorOutput "示例:" "White"
    Write-ColorOutput "  .\docker-start.ps1 build    # 构建镜像" "Gray"
    Write-ColorOutput "  .\docker-start.ps1 up       # 启动服务" "Gray"
    Write-ColorOutput "  .\docker-start.ps1 logs     # 查看日志" "Gray"
}

# 主逻辑
Write-ColorOutput "🐳 AI工具箱 Docker 管理器" "Cyan"
Write-ColorOutput "=========================" "Cyan"

# 检查Docker状态
if (-not (Test-DockerRunning)) {
    exit 1
}

# 检查必要文件
if (-not (Test-RequiredFiles)) {
    exit 1
}

# 执行命令
switch ($Command.ToLower()) {
    "build" {
        Build-Images
    }
    "up" {
        Start-Services
    }
    "down" {
        Stop-Services
    }
    "restart" {
        Restart-Services
    }
    "logs" {
        Show-Logs
    }
    "clean" {
        Clean-Resources
    }
    "help" {
        Show-Help
    }
    default {
        Write-ColorOutput "❌ 未知命令: $Command" "Red"
        Write-ColorOutput "使用 '.\docker-start.ps1 help' 查看可用命令" "Yellow"
        exit 1
    }
}