# AI工具箱

一个基于AI的多功能工具箱，包含智能翻译和合同审批功能。

## 🌟 功能特性

### 🌐 智能翻译
- **多语言支持**：支持中文、英语、日语、韩语、法语、德语、西班牙语等多种语言互译
- **置信度显示**：实时显示翻译结果的置信度评分
- **长文本支持**：支持长篇文档和文章的翻译处理
- **实时翻译**：快速响应的翻译服务，60秒超时保障
- **专业术语**：基于Dify工作流提供准确的翻译结果
- **语音功能**：支持翻译结果的语音朗读
- **一键复制**：支持翻译结果的快速复制
- **语言切换**：支持源语言和目标语言的快速切换

### 📋 合同审批
- **智能合同分析**：支持多种合同类型的智能识别和分析
- **风险评估可视化**：自动识别合同中的潜在风险点，提供风险等级颜色标识
- **审批建议**：基于AI分析提供专业的审批建议
- **指标数值解析**：自动解析并显示合同关键指标（风险等级、合规性、建议等级）
- **Markdown格式**：审批结果支持Markdown格式显示，层次清晰
- **DOCX导出**：支持将审批建议导出为Word文档
- **文件上传**：支持拖拽上传或点击选择合同文件
- **文件类型验证**：支持PDF、DOC、DOCX、TXT等多种文件格式
- **文件大小限制**：最大支持10MB文件上传

## 🛠️ 技术栈

### 前端技术
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具和开发服务器
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 美观的图标库
- **React Router** - 客户端路由管理
- **Zustand** - 轻量级状态管理
- **Sonner** - 优雅的通知组件

### 后端技术
- **FastAPI** - 现代Python Web框架
- **Python 3.8+** - 开发语言
- **Pydantic** - 数据验证和序列化
- **HTTPX** - 异步HTTP客户端
- **python-multipart** - 文件上传处理
- **aiofiles** - 异步文件操作
- **CORS中间件** - 跨域请求支持

### AI服务
- **Dify AI平台** - 提供翻译和合同审批AI能力
- **工作流API** - 智能处理和分析
- **聊天机器人** - 集成智能对话功能

### 部署技术
- **Docker** + **Docker Compose** - 容器化部署
- **Nginx** - 反向代理和静态文件服务
- **Vercel** - 前端托管平台
- **Railway** - 后端部署平台（可选）

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- Python 3.8+
- npm 或 yarn
- Docker 和 Docker Compose（可选，用于容器化部署）

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd AI工具箱
```

### 2. 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# Dify AI配置
DIFY_API_KEY=your_dify_api_key_here
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_TRANSLATION_APP_ID=your_translation_app_id_here
DIFY_CONTRACT_APP_ID=your_contract_app_id_here

# 服务器配置
HOST=127.0.0.1
PORT=5173

# 前端配置
VITE_API_BASE_URL=http://127.0.0.1:5173
```

### 3. 安装依赖

#### 前端依赖
```bash
npm install
```

#### 后端依赖
```bash
cd backend
pip install -r requirements.txt
```

### 4. 启动服务

#### 启动后端服务
```bash
cd backend
python main.py
# 或使用uvicorn
uvicorn main:app --host 127.0.0.1 --port 5173 --reload
```

#### 启动前端服务
```bash
npm run dev
```

### 5. 访问应用
- 前端应用：http://localhost:5173
- 后端API：http://127.0.0.1:5173
- API文档：http://127.0.0.1:5173/docs

## 📁 项目结构

```
AI工具箱/
├── src/                    # 前端源码
│   ├── components/          # 可复用组件
│   │   └── Empty.tsx       # 空状态组件
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx            # 首页（聊天机器人界面）
│   │   ├── ContractReview.tsx  # 合同审批页面
│   │   └── Translator.tsx      # 翻译页面
│   ├── hooks/              # 自定义Hooks
│   │   └── useTheme.ts     # 主题管理Hook
│   ├── types/              # TypeScript类型定义
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口文件
│   └── index.css           # 全局样式
├── backend/                # 后端源码
│   ├── main.py             # FastAPI主应用
│   ├── requirements.txt    # Python依赖列表
│   ├── .env.example        # 后端环境变量模板
│   └── railway.json        # Railway部署配置
├── docs/                   # 文档目录
│   └── 合同审批指标说明.md   # 合同审批功能说明
├── public/                 # 静态资源
│   └── favicon.svg         # 网站图标
├── .trae/                  # Trae AI配置
│   ├── TODO.md             # 待办事项
│   └── documents/          # 项目文档
│       ├── AI工具箱产品需求文档.md
│       └── AI工具箱技术架构文档.md
├── docker-compose.yml      # Docker Compose配置
├── Dockerfile.frontend     # 前端Docker镜像
├── Dockerfile.backend      # 后端Docker镜像
├── nginx.conf              # Nginx配置文件
├── .env.docker             # Docker环境变量
├── .dockerignore           # Docker忽略文件
├── docker-start.bat        # Windows Docker启动脚本
├── docker-start.ps1        # PowerShell Docker启动脚本
├── docker-start.sh         # Linux/Mac Docker启动脚本
├── DOCKER_DEPLOY.md        # Docker部署文档
├── vercel.json             # Vercel部署配置
├── .vercelignore           # Vercel忽略文件
├── package.json            # 前端依赖配置
├── vite.config.ts          # Vite构建配置
├── tailwind.config.js      # Tailwind CSS配置
├── tsconfig.json           # TypeScript配置
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 📖 使用指南

### 合同审批功能
1. 访问合同审批页面
2. 选择合同类型（采购合同、销售合同、服务合同等）
3. 上传合同文件（支持拖拽或点击上传）
   - 支持格式：PDF、DOC、DOCX、TXT
   - 文件大小：最大10MB
4. 点击"开始审批"按钮
5. 查看AI生成的审批建议：
   - 🔴 高风险、🟡 中风险、🟢 低风险标识
   - 合规性分析
   - 具体建议和改进意见
6. 可选择导出审批结果为DOCX文档

### 翻译功能
1. 访问翻译页面
2. 选择源语言和目标语言
3. 输入需要翻译的文本
4. 点击翻译按钮获取结果
5. 查看翻译结果：
   - 翻译文本
   - 置信度评分
   - 语音朗读功能
   - 一键复制功能

## 🔌 API接口文档

### 合同审批API
```http
POST /api/contract/review
Content-Type: multipart/form-data

参数：
- file: 合同文件（必需）
- contract_type: 合同类型（必需）

响应：
{
  "success": true,
  "data": {
    "review_result": "审批建议内容",
    "risk_level": "medium",
    "compliance_score": 85,
    "recommendation_level": "approve_with_conditions"
  }
}
```

### 翻译API
```http
POST /api/translation/translate
Content-Type: application/json

参数：
{
  "text": "要翻译的文本",
  "source_language": "zh",
  "target_language": "en"
}

响应：
{
  "success": true,
  "data": {
    "translated_text": "翻译结果",
    "confidence_score": 0.95,
    "source_language": "zh",
    "target_language": "en"
  }
}
```

### 健康检查API
```http
GET /health
GET /api/health

响应：
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

## 🔧 开发指南

### 前端开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 后端开发
```bash
# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
python main.py

# 或使用uvicorn（推荐）
uvicorn main:app --reload --host 127.0.0.1 --port 5173
```

### 代理配置

前端开发时，Vite会自动将 `/api` 请求代理到后端服务器：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 🚀 部署指南

### 📋 部署方式概览

本项目支持多种部署方式，请根据您的需求选择：

| 部署方式 | 适用场景 | 难度 | 推荐指数 |
|---------|---------|------|----------|
| 本地开发部署 | 开发测试 | ⭐ | ⭐⭐⭐⭐⭐ |
| 传统生产部署 | 生产环境 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Ubuntu Server部署 | Linux服务器 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Vercel部署 | 快速上线 | ⭐⭐ | ⭐⭐⭐ |

---

## 🔧 1. 本地开发部署

### 系统要求
- **Node.js**: 18.0+ (推荐 LTS 版本)
- **Python**: 3.8+ (推荐 3.9+)
- **npm**: 8.0+ 或 **yarn**: 1.22+
- **Git**: 最新版本

### 快速开始

#### 步骤1：克隆项目
```bash
# 克隆仓库
git clone <your-repo-url>
cd AI工具箱

# 查看项目结构
ls -la
```

#### 步骤2：环境变量配置
```bash
# 复制环境变量模板
cp backend/.env.example .env

# 编辑环境变量（重要！）
nano .env
# 或使用其他编辑器
vim .env
code .env
```

**环境变量配置示例：**
```env
# ===========================================
# AI工具箱 - 环境变量配置
# ===========================================

# Dify AI平台配置（必需）
DIFY_API_KEY=app-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_TRANSLATION_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DIFY_CONTRACT_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 服务器配置
HOST=127.0.0.1
PORT=8000

# 前端配置
VITE_API_BASE_URL=http://127.0.0.1:8000

# 开发模式配置
DEBUG=true
LOG_LEVEL=info
```

#### 步骤3：安装依赖
```bash
# 安装前端依赖
npm install
# 或使用 yarn
yarn install

# 安装后端依赖
cd backend
pip install -r requirements.txt
# 推荐使用虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows
pip install -r requirements.txt
cd ..
```

#### 步骤4：启动服务

**方式一：分别启动（推荐开发时使用）**
```bash
# 终端1：启动后端服务
cd backend
python main.py
# 后端将运行在 http://127.0.0.1:8000

# 终端2：启动前端服务
npm run dev
# 前端将运行在 http://localhost:5173
```

**方式二：使用并发启动**
```bash
# 安装并发工具
npm install -g concurrently

# 同时启动前后端
npm run dev:all
```

#### 步骤5：验证部署
```bash
# 检查后端健康状态
curl http://127.0.0.1:8000/health

# 检查前端访问
curl http://localhost:5173

# 查看API文档
# 访问：http://127.0.0.1:8000/docs
```

---

## 🏭 2. 传统生产环境部署

### 系统要求
- **操作系统**: Linux (Ubuntu 20.04+ 推荐) / CentOS 7+ / Windows Server
- **内存**: 最低 2GB，推荐 4GB+
- **存储**: 最低 10GB 可用空间
- **网络**: 稳定的互联网连接

### 部署步骤

#### 步骤1：环境准备
```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl wget git vim unzip

# 安装 Node.js (使用 NodeSource 仓库)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version
npm --version

# 安装 Python 和 pip
sudo apt install -y python3 python3-pip python3-venv
python3 --version
pip3 --version
```

#### 步骤2：创建应用用户
```bash
# 创建专用用户（安全最佳实践）
sudo useradd -m -s /bin/bash ai-toolbox
sudo usermod -aG sudo ai-toolbox

# 切换到应用用户
sudo su - ai-toolbox
```

#### 步骤3：部署应用
```bash
# 克隆项目到生产目录
cd /opt
sudo git clone <your-repo-url> ai-toolbox
sudo chown -R ai-toolbox:ai-toolbox ai-toolbox
cd ai-toolbox

# 安装前端依赖并构建
npm ci --production
npm run build

# 安装后端依赖
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

#### 步骤4：配置环境变量
```bash
# 创建生产环境配置
sudo nano /opt/ai-toolbox/.env
```

**生产环境配置：**
```env
# 生产环境配置
DIFY_API_KEY=your_production_api_key_here
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_TRANSLATION_APP_ID=your_translation_app_id
DIFY_CONTRACT_APP_ID=your_contract_app_id

# 服务器配置
HOST=0.0.0.0
PORT=8000

# 前端配置
VITE_API_BASE_URL=http://your-domain.com:8000

# 生产模式配置
DEBUG=false
LOG_LEVEL=warning
ENVIRONMENT=production
```

#### 步骤5：安装静态文件服务器
```bash
# 全局安装 serve
npm install -g serve

# 或安装 http-server
npm install -g http-server
```

---

## 🐧 3. Ubuntu Server 详细部署指南

### 完整部署流程

#### 3.1 系统初始化
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y curl wget git vim htop tree unzip software-properties-common

# 配置时区
sudo timedatectl set-timezone Asia/Shanghai

# 查看系统信息
uname -a
lsb_release -a
```

#### 3.2 安装 Node.js 和 npm
```bash
# 方式1：使用 NodeSource 仓库（推荐）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 方式2：使用 snap
# sudo snap install node --classic

# 验证安装
node --version  # 应显示 v18.x.x
npm --version   # 应显示 9.x.x

# 配置 npm 镜像（可选，提升下载速度）
npm config set registry https://registry.npmmirror.com
```

#### 3.3 安装 Python 环境
```bash
# 安装 Python 3.9+
sudo apt install -y python3.9 python3.9-venv python3.9-dev python3-pip

# 设置 Python 别名
echo 'alias python=python3.9' >> ~/.bashrc
echo 'alias pip=pip3' >> ~/.bashrc
source ~/.bashrc

# 升级 pip
python -m pip install --upgrade pip

# 验证安装
python --version
pip --version
```

#### 3.4 安装 PM2 进程管理器
```bash
# 全局安装 PM2
npm install -g pm2

# 验证安装
pm2 --version

# 设置 PM2 开机自启
pm2 startup
# 按照提示执行返回的命令
```

#### 3.5 部署应用代码
```bash
# 创建应用目录
sudo mkdir -p /var/www/ai-toolbox
sudo chown -R $USER:$USER /var/www/ai-toolbox

# 克隆项目
cd /var/www
git clone <your-repo-url> ai-toolbox
cd ai-toolbox

# 设置正确的权限
sudo chown -R $USER:$USER /var/www/ai-toolbox
chmod -R 755 /var/www/ai-toolbox
```

#### 3.6 配置环境变量
```bash
# 创建环境配置文件
nano /var/www/ai-toolbox/.env
```

**完整环境变量配置：**
```env
# ===========================================
# AI工具箱 - 生产环境配置
# ===========================================

# Dify AI平台配置
DIFY_API_KEY=app-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_TRANSLATION_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DIFY_CONTRACT_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 服务器配置
HOST=0.0.0.0
PORT=8000
WORKERS=4

# 前端配置
VITE_API_BASE_URL=http://your-server-ip:8000

# 安全配置
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-domain.com,your-server-ip

# 日志配置
LOG_LEVEL=info
LOG_FILE=/var/log/ai-toolbox/app.log

# 性能配置
MAX_UPLOAD_SIZE=10485760  # 10MB
REQUEST_TIMEOUT=60

# 环境标识
ENVIRONMENT=production
DEBUG=false
```

#### 3.7 安装依赖和构建
```bash
cd /var/www/ai-toolbox

# 安装前端依赖
npm ci --production

# 构建前端
npm run build

# 验证构建结果
ls -la dist/

# 安装后端依赖
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 测试后端启动
python main.py &
sleep 5
curl http://localhost:8000/health
kill %1  # 停止测试进程

cd ..
```

---

## ⚙️ 4. PM2 进程管理配置

### 4.1 创建 PM2 配置文件
```bash
# 创建 PM2 生态系统配置
nano /var/www/ai-toolbox/ecosystem.config.js
```

**PM2 配置文件：**
```javascript
module.exports = {
  apps: [
    {
      // 后端应用配置
      name: 'ai-toolbox-backend',
      script: 'main.py',
      cwd: '/var/www/ai-toolbox/backend',
      interpreter: '/var/www/ai-toolbox/backend/venv/bin/python',
      instances: 2,  // 根据CPU核心数调整
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: '/var/log/ai-toolbox/backend-error.log',
      out_file: '/var/log/ai-toolbox/backend-out.log',
      log_file: '/var/log/ai-toolbox/backend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10
    },
    {
      // 前端应用配置
      name: 'ai-toolbox-frontend',
      script: 'serve',
      args: '-s dist -l 3000 -n',
      cwd: '/var/www/ai-toolbox',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/ai-toolbox/frontend-error.log',
      out_file: '/var/log/ai-toolbox/frontend-out.log',
      log_file: '/var/log/ai-toolbox/frontend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
```

### 4.2 创建日志目录
```bash
# 创建日志目录
sudo mkdir -p /var/log/ai-toolbox
sudo chown -R $USER:$USER /var/log/ai-toolbox
chmod 755 /var/log/ai-toolbox
```

### 4.3 启动和管理服务
```bash
# 启动所有服务
cd /var/www/ai-toolbox
pm2 start ecosystem.config.js

# 查看服务状态
pm2 status
pm2 list

# 查看详细信息
pm2 show ai-toolbox-backend
pm2 show ai-toolbox-frontend

# 查看日志
pm2 logs
pm2 logs ai-toolbox-backend
pm2 logs ai-toolbox-frontend

# 重启服务
pm2 restart all
pm2 restart ai-toolbox-backend

# 停止服务
pm2 stop all
pm2 delete all

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 执行返回的命令
pm2 save
```

### 4.4 PM2 监控和管理
```bash
# 实时监控
pm2 monit

# 查看资源使用
pm2 show ai-toolbox-backend

# 重载配置（零停机）
pm2 reload ecosystem.config.js

# 查看进程详情
pm2 describe ai-toolbox-backend

# 清理日志
pm2 flush

# 重置重启计数
pm2 reset ai-toolbox-backend
```

---

## 🌐 5. Nginx 反向代理配置

### 5.1 安装 Nginx
```bash
# 安装 Nginx
sudo apt install -y nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx

# 测试配置
sudo nginx -t
```

### 5.2 配置 Nginx
```bash
# 创建站点配置
sudo nano /etc/nginx/sites-available/ai-toolbox
```

**Nginx 配置文件：**
```nginx
# AI工具箱 Nginx 配置
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # 日志配置
    access_log /var/log/nginx/ai-toolbox.access.log;
    error_log /var/log/nginx/ai-toolbox.error.log;
    
    # 前端静态文件
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API 后端代理
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 文件上传大小限制
        client_max_body_size 10M;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}

# HTTPS 重定向（可选）
# server {
#     listen 443 ssl http2;
#     server_name your-domain.com www.your-domain.com;
#     
#     ssl_certificate /path/to/your/certificate.crt;
#     ssl_certificate_key /path/to/your/private.key;
#     
#     # SSL 配置
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
#     ssl_prefer_server_ciphers off;
#     
#     # 其他配置同上...
# }
```

### 5.3 启用站点配置
```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/ai-toolbox /etc/nginx/sites-enabled/

# 删除默认站点（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx

# 查看状态
sudo systemctl status nginx
```

---

## 🔥 6. 防火墙配置

### 6.1 UFW 防火墙配置
```bash
# 检查防火墙状态
sudo ufw status

# 启用防火墙
sudo ufw enable

# 允许 SSH（重要！）
sudo ufw allow ssh
sudo ufw allow 22

# 允许 HTTP 和 HTTPS
sudo ufw allow 80
sudo ufw allow 443

# 允许应用端口（如果不使用 Nginx）
sudo ufw allow 3000  # 前端
sudo ufw allow 8000  # 后端

# 查看规则
sudo ufw status numbered

# 删除规则（如需要）
# sudo ufw delete [number]
```

### 6.2 iptables 配置（高级）
```bash
# 查看当前规则
sudo iptables -L

# 允许已建立的连接
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 允许本地回环
sudo iptables -A INPUT -i lo -j ACCEPT

# 允许 SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许 HTTP/HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 保存规则
sudo iptables-save > /etc/iptables/rules.v4
```

---

## 🔍 7. 验证部署

### 7.1 服务状态检查
```bash
# 检查 PM2 进程
pm2 status
pm2 logs --lines 50

# 检查端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :80

# 检查系统资源
htop
free -h
df -h
```

### 7.2 功能测试
```bash
# 测试后端 API
curl -X GET http://localhost:8000/health
curl -X GET http://your-domain.com/api/health

# 测试前端访问
curl -I http://localhost:3000
curl -I http://your-domain.com

# 测试文件上传（可选）
curl -X POST -F "file=@test.txt" http://localhost:8000/api/contract/review
```

### 7.3 性能测试
```bash
# 安装测试工具
sudo apt install -y apache2-utils

# 并发测试
ab -n 100 -c 10 http://your-domain.com/
ab -n 100 -c 10 http://your-domain.com/api/health

# 查看响应时间
curl -w "@curl-format.txt" -o /dev/null -s http://your-domain.com/
```

---

## 🚨 8. 故障排除和常见问题

### 8.1 常见错误及解决方案

#### 问题1：端口被占用
```bash
# 查找占用端口的进程
sudo lsof -i :8000
sudo lsof -i :3000

# 杀死进程
sudo kill -9 [PID]

# 或使用 fuser
sudo fuser -k 8000/tcp
```

#### 问题2：权限错误
```bash
# 修复文件权限
sudo chown -R $USER:$USER /var/www/ai-toolbox
chmod -R 755 /var/www/ai-toolbox

# 修复日志权限
sudo chown -R $USER:$USER /var/log/ai-toolbox
chmod 755 /var/log/ai-toolbox
```

#### 问题3：Python 虚拟环境问题
```bash
# 重新创建虚拟环境
cd /var/www/ai-toolbox/backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### 问题4：Node.js 内存不足
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 或在 PM2 配置中添加
# node_args: "--max-old-space-size=4096"
```

#### 问题5：Nginx 配置错误
```bash
# 测试 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 重新加载配置
sudo systemctl reload nginx
```

### 8.2 日志分析
```bash
# 查看应用日志
pm2 logs ai-toolbox-backend --lines 100
pm2 logs ai-toolbox-frontend --lines 100

# 查看系统日志
sudo journalctl -u nginx -f
sudo tail -f /var/log/syslog

# 查看访问日志
sudo tail -f /var/log/nginx/ai-toolbox.access.log
```

### 8.3 性能监控
```bash
# 实时监控
pm2 monit
htop
iotop

# 磁盘使用
df -h
du -sh /var/www/ai-toolbox

# 内存使用
free -h
cat /proc/meminfo
```

---

## ⚡ 9. 性能优化建议

### 9.1 系统级优化
```bash
# 调整系统参数
echo 'net.core.somaxconn = 65535' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 65535' | sudo tee -a /etc/sysctl.conf
echo 'fs.file-max = 100000' | sudo tee -a /etc/sysctl.conf

# 应用配置
sudo sysctl -p

# 调整文件描述符限制
echo '* soft nofile 65535' | sudo tee -a /etc/security/limits.conf
echo '* hard nofile 65535' | sudo tee -a /etc/security/limits.conf
```

### 9.2 应用级优化
```bash
# PM2 集群模式
pm2 start ecosystem.config.js --env production

# 启用 PM2 监控
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 9.3 数据库优化（如适用）
```bash
# Redis 缓存（可选）
sudo apt install -y redis-server
sudo systemctl enable redis-server

# 配置 Redis
sudo nano /etc/redis/redis.conf
# 设置 maxmemory 和 maxmemory-policy
```

### 9.4 CDN 和缓存
```nginx
# 在 Nginx 配置中添加缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}
```

---

## 🔄 10. 更新和维护

### 10.1 应用更新流程
```bash
# 创建更新脚本
nano /var/www/ai-toolbox/update.sh
```

**更新脚本：**
```bash
#!/bin/bash
# AI工具箱更新脚本

set -e

echo "开始更新 AI工具箱..."

# 备份当前版本
cp -r /var/www/ai-toolbox /var/www/ai-toolbox.backup.$(date +%Y%m%d_%H%M%S)

# 拉取最新代码
cd /var/www/ai-toolbox
git pull origin main

# 安装新依赖
npm ci --production

# 重新构建前端
npm run build

# 更新后端依赖
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

# 重启服务
pm2 reload ecosystem.config.js

# 等待服务启动
sleep 10

# 健康检查
if curl -f http://localhost:8000/health; then
    echo "✅ 更新成功！"
    # 清理旧备份（保留最近3个）
    ls -t /var/www/ai-toolbox.backup.* | tail -n +4 | xargs rm -rf
else
    echo "❌ 更新失败，正在回滚..."
    # 回滚逻辑
    LATEST_BACKUP=$(ls -t /var/www/ai-toolbox.backup.* | head -n 1)
    rm -rf /var/www/ai-toolbox
    mv $LATEST_BACKUP /var/www/ai-toolbox
    pm2 reload ecosystem.config.js
    echo "已回滚到之前版本"
    exit 1
fi
```

```bash
# 设置执行权限
chmod +x /var/www/ai-toolbox/update.sh

# 执行更新
./update.sh
```

### 10.2 定期维护任务
```bash
# 创建维护脚本
nano /var/www/ai-toolbox/maintenance.sh
```

**维护脚本：**
```bash
#!/bin/bash
# 定期维护脚本

# 清理日志
find /var/log/ai-toolbox -name "*.log" -mtime +30 -delete

# 清理 PM2 日志
pm2 flush

# 清理系统缓存
sudo apt autoremove -y
sudo apt autoclean

# 检查磁盘空间
df -h

# 检查内存使用
free -h

# 重启服务（可选）
# pm2 restart all

echo "维护完成：$(date)"
```

### 10.3 设置定时任务
```bash
# 编辑 crontab
crontab -e

# 添加定时任务
# 每天凌晨2点执行维护
0 2 * * * /var/www/ai-toolbox/maintenance.sh >> /var/log/ai-toolbox/maintenance.log 2>&1

# 每周日凌晨3点重启服务
0 3 * * 0 /usr/bin/pm2 restart all
```

---

## 📊 11. 监控和告警

### 11.1 基础监控
```bash
# 安装监控工具
sudo apt install -y htop iotop nethogs

# 创建监控脚本
nano /var/www/ai-toolbox/monitor.sh
```

**监控脚本：**
```bash
#!/bin/bash
# 系统监控脚本

# 检查服务状态
if ! pm2 list | grep -q "online"; then
    echo "警告：PM2 服务异常" | mail -s "AI工具箱服务告警" admin@example.com
fi

# 检查磁盘空间
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "警告：磁盘使用率超过80%" | mail -s "磁盘空间告警" admin@example.com
fi

# 检查内存使用
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ $MEM_USAGE -gt 90 ]; then
    echo "警告：内存使用率超过90%" | mail -s "内存使用告警" admin@example.com
fi
```

### 11.2 应用监控
```bash
# 健康检查脚本
nano /var/www/ai-toolbox/health-check.sh
```

**健康检查脚本：**
```bash
#!/bin/bash
# 应用健康检查

# 检查后端健康
if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "后端服务异常，尝试重启..."
    pm2 restart ai-toolbox-backend
    sleep 10
    if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo "后端服务重启失败" | mail -s "后端服务告警" admin@example.com
    fi
fi

# 检查前端健康
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "前端服务异常，尝试重启..."
    pm2 restart ai-toolbox-frontend
    sleep 10
    if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "前端服务重启失败" | mail -s "前端服务告警" admin@example.com
    fi
fi
```

---

## 🔐 12. 安全配置

### 12.1 SSL/TLS 配置
```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 设置自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 12.2 安全加固
```bash
# 禁用不必要的服务
sudo systemctl disable apache2
sudo systemctl stop apache2

# 配置 fail2ban
sudo apt install -y fail2ban
sudo systemctl enable fail2ban

# SSH 安全配置
sudo nano /etc/ssh/sshd_config
# 修改：
# Port 2222
# PermitRootLogin no
# PasswordAuthentication no

sudo systemctl restart ssh
```

---

## 🌟 13. Vercel 部署（快速上线）

### 13.1 Vercel 配置
项目已配置 Vercel 部署支持，包含以下文件：
- `vercel.json` - Vercel 部署配置
- `.vercelignore` - 忽略文件配置

### 13.2 部署步骤
1. **连接 GitHub 仓库到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库

2. **配置环境变量**：
   ```env
   DIFY_API_KEY=your_api_key_here
   DIFY_BASE_URL=https://api.dify.ai/v1
   DIFY_TRANSLATION_APP_ID=your_translation_app_id
   DIFY_CONTRACT_APP_ID=your_contract_app_id
   ```

3. **自动部署**：推送到主分支即可触发部署

### 13.3 后端部署（Railway）
```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录 Railway
railway login

# 部署后端
cd backend
railway deploy
```

---

## 📞 技术支持

如果在部署过程中遇到问题，请按以下步骤排查：

1. **检查日志**：查看详细的错误信息
2. **验证配置**：确认环境变量和配置文件
3. **测试连接**：验证网络和服务连接
4. **查看文档**：参考故障排除章节
5. **寻求帮助**：提交 Issue 或联系技术支持

**常用命令速查：**
```bash
# 查看服务状态
pm2 status
sudo systemctl status nginx

# 查看日志
pm2 logs
sudo tail -f /var/log/nginx/error.log

# 重启服务
pm2 restart all
sudo systemctl restart nginx

# 健康检查
curl http://localhost:8000/health
curl http://localhost:3000
```

---

**🎉 恭喜！您已完成 AI工具箱的部署配置。**

如有任何问题，请参考故障排除章节或提交 Issue 获取帮助。

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 故障排除

### 常见问题

1. **CORS错误**
   - 确保后端CORS配置正确
   - 检查前端请求URL是否正确

2. **API连接失败**
   - 确认后端服务正在运行
   - 检查环境变量配置
   - 验证Dify API密钥是否有效

3. **文件上传失败**
   - 检查文件大小是否超过10MB
   - 确认文件格式是否支持
   - 验证后端文件处理配置

4. **翻译服务超时**
   - 检查网络连接
   - 确认Dify服务状态
   - 减少翻译文本长度

### 日志查看

- 前端日志：浏览器开发者工具控制台
- 后端日志：终端输出或日志文件

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 创建 Discussion

---

**感谢使用AI工具箱！** 🎉