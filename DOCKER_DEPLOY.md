# AI工具箱 Docker 部署指南

本文档提供了AI工具箱项目的完整Docker部署方案，支持一键部署和管理。

## 📋 部署前准备

### 系统要求
- Docker Engine 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

### 环境配置
1. 确保Docker Desktop已安装并运行
2. 检查端口占用情况（3000、8000端口需要空闲）
3. 配置环境变量文件 `.env.docker`

## 🚀 快速部署

### Windows 用户
```powershell
# 一键启动
.\docker-start.ps1

# 或者分步执行
.\docker-start.ps1 build    # 构建镜像
.\docker-start.ps1 up       # 启动服务
```

### Linux/macOS 用户
```bash
# 添加执行权限
chmod +x docker-start.sh

# 一键启动
./docker-start.sh

# 或者分步执行
./docker-start.sh build    # 构建镜像
./docker-start.sh up       # 启动服务
```

### 手动部署
```bash
# 构建镜像
docker-compose --env-file .env.docker build

# 启动服务
docker-compose --env-file .env.docker up -d
```

## 📁 项目结构

```
AI工具箱/
├── docker-compose.yml      # Docker编排配置
├── Dockerfile.frontend     # 前端镜像构建文件
├── Dockerfile.backend      # 后端镜像构建文件
├── nginx.conf              # Nginx配置文件
├── .env.docker             # Docker环境变量
├── .dockerignore           # Docker忽略文件
├── docker-start.ps1        # Windows启动脚本
├── docker-start.sh         # Linux/macOS启动脚本
└── DOCKER_DEPLOY.md        # 部署文档
```

## 🔧 配置说明

### 环境变量配置 (.env.docker)
```env
# 前端配置
VITE_API_BASE_URL=http://localhost:8000

# 后端配置
DIFY_BASE_URL=http://113.45.43.33/v1
DIFY_CONTRACT_API_KEY=your_contract_api_key
DIFY_TRANSLATION_API_KEY=your_translation_api_key
HOST=0.0.0.0
PORT=8000
PYTHONPATH=/app
LOG_LEVEL=info
```

### 服务端口映射
- **前端服务**: `localhost:3000` → 容器内部 `80`
- **后端服务**: `localhost:8000` → 容器内部 `8000`

### 网络配置
- 网络名称: `ai-toolbox-network`
- 前端通过 `/api/` 路径代理到后端服务
- 容器间通信使用服务名称解析

## 📊 服务管理

### 启动脚本命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `build` | 构建Docker镜像 | `./docker-start.sh build` |
| `up` | 启动服务（默认） | `./docker-start.sh up` |
| `down` | 停止服务 | `./docker-start.sh down` |
| `restart` | 重启服务 | `./docker-start.sh restart` |
| `logs` | 查看日志 | `./docker-start.sh logs` |
| `clean` | 清理所有资源 | `./docker-start.sh clean` |
| `help` | 显示帮助信息 | `./docker-start.sh help` |

### 手动管理命令
```bash
# 查看运行状态
docker-compose --env-file .env.docker ps

# 查看日志
docker-compose --env-file .env.docker logs -f [service_name]

# 进入容器
docker-compose --env-file .env.docker exec frontend sh
docker-compose --env-file .env.docker exec backend bash

# 重新构建特定服务
docker-compose --env-file .env.docker build --no-cache frontend
docker-compose --env-file .env.docker build --no-cache backend
```

## 🔍 故障排除

### 常见问题

#### 1. 端口占用
```bash
# 检查端口占用
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Windows检查端口
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

#### 2. 镜像构建失败
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建（无缓存）
docker-compose --env-file .env.docker build --no-cache
```

#### 3. 服务无法访问
- 检查防火墙设置
- 确认Docker Desktop正在运行
- 验证环境变量配置
- 查看容器日志排查错误

#### 4. API请求失败
- 检查后端服务是否正常启动
- 验证Dify API密钥配置
- 确认网络连接正常

### 日志查看
```bash
# 查看所有服务日志
docker-compose --env-file .env.docker logs

# 查看特定服务日志
docker-compose --env-file .env.docker logs frontend
docker-compose --env-file .env.docker logs backend

# 实时查看日志
docker-compose --env-file .env.docker logs -f
```

## 🔒 安全配置

### 生产环境建议
1. **环境变量安全**
   - 使用Docker Secrets管理敏感信息
   - 不要在镜像中硬编码API密钥
   - 定期轮换API密钥

2. **网络安全**
   - 使用HTTPS（配置SSL证书）
   - 限制容器间不必要的网络访问
   - 配置防火墙规则

3. **容器安全**
   - 使用非root用户运行应用
   - 定期更新基础镜像
   - 扫描镜像漏洞

## 📈 性能优化

### 资源限制
```yaml
# 在docker-compose.yml中添加资源限制
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
```

### 缓存优化
- 利用Docker层缓存加速构建
- 配置Nginx静态资源缓存
- 使用多阶段构建减小镜像体积

## 🔄 更新部署

### 代码更新流程
```bash
# 1. 停止服务
./docker-start.sh down

# 2. 拉取最新代码
git pull origin main

# 3. 重新构建镜像
./docker-start.sh build

# 4. 启动服务
./docker-start.sh up
```

### 零停机更新
```bash
# 使用滚动更新
docker-compose --env-file .env.docker up -d --no-deps --build frontend
docker-compose --env-file .env.docker up -d --no-deps --build backend
```

## 📞 技术支持

如果在部署过程中遇到问题，请：
1. 查看本文档的故障排除部分
2. 检查容器日志获取详细错误信息
3. 确认所有配置文件格式正确
4. 验证网络和端口配置

---

**部署成功后访问地址：**
- 🌐 前端应用：http://localhost:3000
- 🔧 后端API：http://localhost:8000
- 📊 API文档：http://localhost:8000/docs